import { Controller } from "@/application/contracts/Controller";
import { CreateSubscriptionClientUseCase } from "@/application/useCases/SubscriptionClient/CreateSubscriptionClientUseCase";
import { Injectable } from "@/kernel/decorators/Injectable";
import { AppConfig } from "@/shared/config/Appconfig";
import Stripe from "stripe";

@Injectable()
export class StripeWebhookClientController extends Controller<
  "public",
  StripeWebhookClientController.Response
> {
  private readonly stripe;

  constructor(
    private readonly createSubscriptionClientUseCase: CreateSubscriptionClientUseCase,
    private readonly appConfig: AppConfig,
  ) {
    super();
    this.stripe = new Stripe(this.appConfig.stripe.stripeSecretKey);
  }

  protected override async handle({
    headers,
    rawBody,
  }: Controller.Request<"public">): Promise<
    Controller.Response<StripeWebhookClientController.Response>
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
      this.appConfig.stripe.webhookClientSecret,
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
    const clientAccountId = session.metadata.clientAccountId;
    const barbershopId = session.metadata.barbershopId;
    const planId = session.metadata.planId;
    const stripeSubscriptionId = session.subscription;
    const stripeCustomerId = session.customer;

    await this.createSubscriptionClientUseCase.execute({
      planId,
      barbershopId,
      clientAccountId,
      stripeSubscriptionId,
      stripeCustomerId,
    });
  }
}

export namespace StripeWebhookClientController {
  export type Response = void;
}
