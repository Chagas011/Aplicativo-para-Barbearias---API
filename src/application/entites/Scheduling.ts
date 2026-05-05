import KSUID from "ksuid";

export class Scheduling {
  readonly id: string;
  readonly accountId: string;
  readonly barber: Scheduling.Barber;
  readonly service: Scheduling.Service;
  readonly date: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly barbershop: Scheduling.Barbershop;
  status: Scheduling.Status;

  readonly createdAt: Date;

  constructor(attr: Scheduling.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.accountId = attr.accountId;
    this.barber = attr.barber;
    this.service = attr.service;
    this.date = attr.date;
    this.startTime = attr.startTime;
    this.endTime = attr.endTime;
    this.barbershop = attr.barbershop;
    this.status = attr.status ?? "SCHEDULED";

    this.createdAt = attr.createdAt ?? new Date();
  }
}

export namespace Scheduling {
  export type Status =
    | "SCHEDULED"
    | "CONFIRMED"
    | "CANCELLED"
    | "COMPLETED"
    | "NO_SHOW";

  export type Attributes = {
    id?: string;

    barber: Barber;
    barbershop: Barbershop;
    service: Service;
    accountId: string;
    date: string;
    startTime: string;
    endTime: string;

    status?: Status;

    createdAt?: Date;
  };

  export type Service = {
    name: string;
    price: number;
    duration: number;
  };

  export type Barber = {
    id: string;
    name: string;
    photoURL?: string | null;
  };

  export type Barbershop = {
    id: string;
    name: string;
    phone: string;
    address: Address;
    photoURL?: string | null;
  };

  export type Address = {
    street: string;
    number: string;
    city: string;
    state: string;
    zipCode: string;
  };
}
