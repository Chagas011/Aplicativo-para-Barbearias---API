import KSUID from "ksuid";

export class Subscription {
  readonly id: string;
  readonly accountId: string;
  readonly createdAt: Date;
  readonly stripeCustomerId: string;
  readonly stripeSubscriptionId: string;
  readonly stripePriceId: string;
  plan: Subscription.Plan;
  status: "ACTIVE" | "CANCELED" | "PAST_DUE";

  constructor(attr: Subscription.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.accountId = attr.accountId;
    this.createdAt = attr.createdAt ?? new Date();
    this.stripeCustomerId = attr.stripeCustomerId;
    this.stripeSubscriptionId = attr.stripeSubscriptionId;
    this.stripePriceId = attr.stripePriceId;
    this.plan = attr.plan;
    this.status = attr.status;
  }
}

export namespace Subscription {
  export type Attributes = {
    id?: string;
    accountId: string;

    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripePriceId: string;

    plan: Plan;
    status: "ACTIVE" | "CANCELED" | "PAST_DUE";
    createdAt?: Date;
  };

  export type Plan = {
    name: string;
    price: number;
    maxBarbershops: number;
  };
}
