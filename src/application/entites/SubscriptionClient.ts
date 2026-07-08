import KSUID from "ksuid";

export class SubscriptionClient {
  readonly id: string;
  readonly accountId: string;
  readonly barbershopId: string;
  readonly stripeCustomerId: string;
  readonly stripeSubscriptionId: string;
  readonly stripePriceId: string;
  readonly stripeConnectAccountId: string;
  readonly createdAt: Date;
  plan: SubscriptionClient.Plan;
  status: "ACTIVE" | "EXPIRED" | "FINISHED";

  constructor(attr: SubscriptionClient.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.accountId = attr.accountId;
    this.barbershopId = attr.barbershopId;
    this.stripeCustomerId = attr.stripeCustomerId;
    this.stripeSubscriptionId = attr.stripeSubscriptionId;
    this.stripePriceId = attr.stripePriceId;
    this.stripeConnectAccountId = attr.stripeConnectAccountId;
    this.createdAt = attr.createdAt ?? new Date();
    this.plan = attr.plan;
    this.status = attr.status;
  }
}

export namespace SubscriptionClient {
  export type Attributes = {
    id?: string;
    accountId: string;
    barbershopId: string;

    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripePriceId: string;
    stripeConnectAccountId: string;

    plan: Plan;
    status: "ACTIVE" | "EXPIRED" | "FINISHED";
    createdAt?: Date;
  };
  export type Plan = {
    id: string;
    name: string;
    price: number;
    remaningServices: number;
  };
}
