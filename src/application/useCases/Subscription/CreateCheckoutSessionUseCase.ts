import { Injectable } from "@/kernel/decorators/Injectable";
import { AppConfig } from "@/shared/config/Appconfig";
import { StripePlansCheckout } from "@/shared/types/StripePlans";
import Stripe from "stripe";

@Injectable()
export class CreateCheckoutSessionUseCase {
  private readonly stripe;
  constructor(private readonly appConfig: AppConfig) {
    this.stripe = new Stripe(this.appConfig.stripe.stripeSecretKey);
  }
  async execute({
    accountId,
    planName,
  }: CreateCheckoutSessionUseCase.Input): Promise<CreateCheckoutSessionUseCase.Output> {
    const { priceId } = StripePlansCheckout[planName];
    if (!priceId) {
      throw new Error("Invalid plan");
    }
    const session = await this.stripe.checkout.sessions.create({
      mode: "subscription",

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url:
        "https://d1kedj493fgm56.cloudfront.net/subscription?success=true",

      cancel_url: "https://d1kedj493fgm56.cloudfront.net/",

      metadata: {
        accountId,
        planName,
      },
    });

    return {
      checkoutUrl: session.url!,
    };
  }
}

export namespace CreateCheckoutSessionUseCase {
  export type Input = {
    accountId: string;
    planName: "PREMIUM" | "BASIC";
  };

  export type Output = {
    checkoutUrl: string;
  };
}
