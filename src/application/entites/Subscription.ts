import KSUID from "ksuid";

export class Subscription {
  readonly id: string;
  readonly accountId: string;
  readonly createdAt: Date;
  plan: Subscription.Plan;
  status: "ACTIVE" | "CANCELED" | "PAST_DUE";

  constructor(attr: Subscription.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.accountId = attr.accountId;
    this.createdAt = attr.createdAt ?? new Date();
    this.plan = attr.plan;
    this.status = attr.status;
  }
}

export namespace Subscription {
  export type Attributes = {
    id?: string;
    accountId: string;
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
