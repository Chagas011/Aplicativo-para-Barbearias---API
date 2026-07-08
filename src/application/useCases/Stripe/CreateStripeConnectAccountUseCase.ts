import { ResouceNotFound } from "@/application/errors/application/ResourceNotFound";
import { AccountRepository } from "@/infra/database/dynamo/repositories/AccountRepository";
import { Injectable } from "@/kernel/decorators/Injectable";
import { AppConfig } from "@/shared/config/Appconfig";
import Stripe from "stripe";
@Injectable()
export class CreateStripeConnectAccountUseCase {
  private readonly stripe;
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly appConfig: AppConfig,
  ) {
    this.stripe = new Stripe(this.appConfig.stripe.stripeSecretKey);
  }

  async execute({
    accountId,
  }: CreateStripeConnectAccountUseCase.Input): Promise<CreateStripeConnectAccountUseCase.Output> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new ResouceNotFound();
    }
    let stripeConnectAccountId = account.stripeConnectAccountId;

    if (!stripeConnectAccountId) {
      const stripeAccount = await this.stripe.accounts.create({
        type: "express",
        email: account.email,
      });
      stripeConnectAccountId = stripeAccount.id;
      account.stripeConnectAccountId = stripeConnectAccountId;
      await this.accountRepository.save(account);
    }

    const accountLink = await this.stripe.accountLinks.create({
      account: stripeConnectAccountId,
      refresh_url: "https://d1kedj493fgm56.cloudfront.net/subscription",
      return_url: "https://d1kedj493fgm56.cloudfront.net/subscription",
      type: "account_onboarding",
    });

    return {
      accountLink: accountLink.url,
    };
  }
}

export namespace CreateStripeConnectAccountUseCase {
  export type Input = {
    accountId: string;
  };

  export type Output = {
    accountLink: string;
  };
}
