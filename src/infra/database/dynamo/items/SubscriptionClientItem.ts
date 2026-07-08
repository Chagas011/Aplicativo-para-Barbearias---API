import { SubscriptionClient } from "@/application/entites/SubscriptionClient";

export class SubscriptionClientItem {
  static readonly type = "SubscriptionClient";

  private readonly keys: SubscriptionClientItem.Keys;

  constructor(private readonly attr: SubscriptionClientItem.Attributes) {
    this.keys = {
      PK: SubscriptionClientItem.getPK(this.attr.accountId),
      SK: SubscriptionClientItem.getSK(this.attr.id),
    };
  }

  toItem(): SubscriptionClientItem.ItemTypes {
    return {
      ...this.keys,
      ...this.attr,
      type: SubscriptionClientItem.type,
    };
  }

  static fromEntity(subscriptionClient: SubscriptionClient) {
    return new SubscriptionClientItem({
      id: subscriptionClient.id,
      barbershopId: subscriptionClient.barbershopId,
      accountId: subscriptionClient.accountId,
      createdAt: subscriptionClient.createdAt.toISOString(),
      plan: subscriptionClient.plan,
      status: subscriptionClient.status,
      stripeCustomerId: subscriptionClient.stripeCustomerId,
      stripePriceId: subscriptionClient.stripePriceId,
      stripeConnectAccountId: subscriptionClient.stripeConnectAccountId,
      stripeSubscriptionId: subscriptionClient.stripeSubscriptionId,
    });
  }

  static toEntity(subscriptionClientItem: SubscriptionClientItem.ItemTypes) {
    return new SubscriptionClient({
      id: subscriptionClientItem.id,
      accountId: subscriptionClientItem.accountId,
      barbershopId: subscriptionClientItem.barbershopId,
      createdAt: new Date(subscriptionClientItem.createdAt),
      plan: subscriptionClientItem.plan,
      status: subscriptionClientItem.status,
      stripeCustomerId: subscriptionClientItem.stripeCustomerId,
      stripePriceId: subscriptionClientItem.stripePriceId,
      stripeConnectAccountId: subscriptionClientItem.stripeConnectAccountId,
      stripeSubscriptionId: subscriptionClientItem.stripeSubscriptionId,
    });
  }

  static getPK(accountId: string): SubscriptionClientItem.Keys["PK"] {
    return `ACCOUNT#${accountId}`;
  }

  static getSK(subscriptionId: string): SubscriptionClientItem.Keys["SK"] {
    return `SUBSCRIPTION#CLIENT#${subscriptionId}`;
  }
}

export namespace SubscriptionClientItem {
  export type Keys = {
    PK: `ACCOUNT#${string}`;
    SK: `SUBSCRIPTION#CLIENT${string}`;
  };

  export type Attributes = {
    id: string;
    accountId: string;
    barbershopId: string;

    createdAt: string;

    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripePriceId: string;
    stripeConnectAccountId: string;
    plan: Plan;
    status: "ACTIVE" | "EXPIRED" | "FINISHED";
  };
  export type Plan = {
    id: string;
    name: string;
    price: number;
    remaningServices: number;
  };
  export type ItemTypes = Keys &
    Attributes & {
      type: "SubscriptionClient";
    };
}
