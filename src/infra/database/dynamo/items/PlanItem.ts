import { Plan } from "@/application/entites/Plan";

export class PlanItem {
  static readonly type = "Plan";

  private readonly keys: PlanItem.Keys;

  constructor(private readonly attr: PlanItem.Attributes) {
    this.keys = {
      PK: PlanItem.getPK(this.attr.barbershopId),
      SK: PlanItem.getSK(this.attr.id),
    };
  }

  toItem(): PlanItem.ItemTypes {
    return {
      ...this.keys,
      ...this.attr,
      type: PlanItem.type,
    };
  }

  static fromEntity(plan: Plan) {
    return new PlanItem({
      id: plan.id,
      accountId: plan.accountId,
      barbershopId: plan.barbershopId,
      createdAt: plan.createdAt.toISOString(),
      name: plan.name,
      price: plan.price,
      remaningServices: plan.remaningServices,
      stripePriceId: plan.stripePriceId,
      stripeProductId: plan.stripeProductId,
      services: plan.services,
    });
  }

  static toEntity(PlanItem: PlanItem.ItemTypes) {
    return new Plan({
      id: PlanItem.id,
      accountId: PlanItem.accountId,
      barbershopId: PlanItem.barbershopId,
      name: PlanItem.name,
      price: PlanItem.price,
      remaningServices: PlanItem.remaningServices,
      stripePriceId: PlanItem.stripePriceId,
      stripeProductId: PlanItem.stripeProductId,
      services: PlanItem.services,
      createdAt: new Date(PlanItem.createdAt),
    });
  }

  static getPK(barbershopId: string): PlanItem.Keys["PK"] {
    return `BARBERSHOP#${barbershopId}`;
  }

  static getSK(planId: string): PlanItem.Keys["SK"] {
    return `PLAN#${planId}`;
  }
}

export namespace PlanItem {
  export type Keys = {
    PK: `BARBERSHOP#${string}`;
    SK: `PLAN#${string}`;
  };

  export type Attributes = {
    id: string;
    accountId: string;
    barbershopId: string;
    createdAt: string;
    name: string;
    price: number;
    remaningServices: number;
    stripeProductId?: string;
    stripePriceId?: string;
    services: string[];
  };

  export type ItemTypes = Keys &
    Attributes & {
      type: "Plan";
    };
}
