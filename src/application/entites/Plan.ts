import KSUID from "ksuid";

export class Plan {
  readonly id: string;
  readonly barbershopId: string;
  readonly createdAt: Date;
  name: string;
  price: number;
  remaningServices: number;
  services: string[];

  constructor(attr: Plan.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.barbershopId = attr.barbershopId;
    this.createdAt = attr.createdAt ?? new Date();
    this.name = attr.name;
    this.price = attr.price;
    this.remaningServices = attr.remaningServices;
    this.services = attr.services;
  }
}

export namespace Plan {
  export type Attributes = {
    id?: string;
    barbershopId: string;
    name: string;
    price: number;
    remaningServices: number;
    services: string[];
    createdAt?: Date;
  };
}
