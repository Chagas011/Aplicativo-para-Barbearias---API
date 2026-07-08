import KSUID from "ksuid";

export class Plan {
  readonly id: string;
  readonly accountId: string;
  readonly barbershopId: string;
  readonly createdAt: Date;
  name: string;
  price: number;
  remaningServices: number;
  services: string[];
  stripeProductId?: string;
  stripePriceId?: string;

  constructor(attr: Plan.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.accountId = attr.accountId;
    this.barbershopId = attr.barbershopId;
    this.createdAt = attr.createdAt ?? new Date();
    this.name = attr.name;
    this.price = attr.price;
    this.remaningServices = attr.remaningServices;
    this.stripePriceId = attr.stripePriceId;
    this.stripeProductId = attr.stripeProductId;
    this.services = attr.services;
  }
}

export namespace Plan {
  export type Attributes = {
    id?: string;
    accountId: string;
    barbershopId: string;
    name: string;
    price: number;
    remaningServices: number;
    stripeProductId?: string;
    stripePriceId?: string;
    services: string[];
    createdAt?: Date;
  };
}
