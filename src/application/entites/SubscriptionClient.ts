import KSUID from "ksuid";

export class SubscriptionClient {
  readonly id: string;
  readonly accountId: string;
  readonly barbershopId: string;
  readonly createdAt: Date;
  plan: SubscriptionClient.Plan;
  status: "ACTIVE" | "EXPIRED" | "FINISHED";

  constructor(attr: SubscriptionClient.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.accountId = attr.accountId;
    this.barbershopId = attr.barbershopId;
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
