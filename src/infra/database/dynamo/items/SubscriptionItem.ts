import { Subscription } from "@/application/entites/Subscription";

export class SubscriptionItem {
  static readonly type = "Subscription";

  private readonly keys: SubscriptionItem.Keys;

  constructor(private readonly attr: SubscriptionItem.Attributes) {
    this.keys = {
      PK: SubscriptionItem.getPK(this.attr.accountId),
      SK: SubscriptionItem.getSK(this.attr.id),
    };
  }

  toItem(): SubscriptionItem.ItemTypes {
    return {
      ...this.keys,
      ...this.attr,
      type: SubscriptionItem.type,
    };
  }

  static fromEntity(subscription: Subscription) {
    return new SubscriptionItem({
      id: subscription.id,
      accountId: subscription.accountId,
      createdAt: subscription.createdAt.toISOString(),
      plan: subscription.plan,
      status: subscription.status,
      stripeCustomerId: subscription.stripeCustomerId,
      stripePriceId: subscription.stripePriceId,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
    });
  }

  static toEntity(subscriptionItem: SubscriptionItem.ItemTypes) {
    return new Subscription({
      id: subscriptionItem.id,
      accountId: subscriptionItem.accountId,
      createdAt: new Date(subscriptionItem.createdAt),
      plan: subscriptionItem.plan,
      status: subscriptionItem.status,
      stripeCustomerId: subscriptionItem.stripeCustomerId,
      stripePriceId: subscriptionItem.stripePriceId,
      stripeSubscriptionId: subscriptionItem.stripeSubscriptionId,
    });
  }

  static getPK(accountId: string): SubscriptionItem.Keys["PK"] {
    return `ACCOUNT#${accountId}`;
  }

  static getSK(subscriptionId: string): SubscriptionItem.Keys["SK"] {
    return `SUBSCRIPTION#${subscriptionId}`;
  }
}

export namespace SubscriptionItem {
  export type Keys = {
    PK: `ACCOUNT#${string}`;
    SK: `SUBSCRIPTION#${string}`;
  };

  export type Attributes = {
    id: string;
    accountId: string;
    createdAt: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripePriceId: string;
    plan: {
      name: string;
      price: number;
      maxBarbershops: number;
    };
    status: "ACTIVE" | "CANCELED" | "PAST_DUE";
  };

  export type ItemTypes = Keys &
    Attributes & {
      type: "Subscription";
    };
}
