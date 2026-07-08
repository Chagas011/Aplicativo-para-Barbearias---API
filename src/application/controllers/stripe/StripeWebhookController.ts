import { Controller } from "@/application/contracts/Controller";
import { CreateSubscriptionUseCase } from "@/application/useCases/Subscription/CreateSubscriptionUseCase";
import { Injectable } from "@/kernel/decorators/Injectable";
import { AppConfig } from "@/shared/config/Appconfig";
import Stripe from "stripe";

@Injectable()
export class StripeWebhookController extends Controller<
  "public",
  StripeWebhookController.Response
> {
  private readonly stripe;

  constructor(
    private readonly createSubscriptionUseCase: CreateSubscriptionUseCase,
    private readonly appConfig: AppConfig,
  ) {
    super();
    this.stripe = new Stripe(this.appConfig.stripe.stripeSecretKey);
  }

  protected override async handle({
    headers,
    rawBody,
  }: Controller.Request<"public">): Promise<
    Controller.Response<StripeWebhookController.Response>
  > {
    const signature = headers["stripe-signature"];
    if (!signature) {
      throw new Error("Stripe signature not found");
    }
    if (!rawBody) {
      throw new Error("Raw body not found");
    }
    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      this.appConfig.stripe.webhookSecret,
    );

    switch (event.type) {
      case "checkout.session.completed":
        await this.handleCheckoutComplete(event.data.object as any);
        break;
      default:
        break;
    }

    return {
      statusCode: 200,
    };
  }

  private async handleCheckoutComplete(session: any): Promise<void> {
    const accountId = session.metadata.accountId;
    if (!accountId) {
      throw new Error("AccountId not found");
    }
    const stripeCustomerId = session.customer as string;
    const stripeSubscriptionId = session.subscription as string;
    const lineItems = await this.stripe.checkout.sessions.listLineItems(
      session.id,
    );
    const priceId = lineItems.data[0]?.price?.id;
    if (!priceId) {
      throw new Error("PriceId not found");
    }
    await this.createSubscriptionUseCase.execute({
      accountId,
      priceId,
      stripeCustomerId,
      stripeSubscriptionId,
    });
  }
}

export namespace StripeWebhookController {
  export type Response = void;
}
