import { Scheduling } from "@/application/entites/Scheduling";

export class SchedulingItem {
  static readonly type = "Scheduling";

  private readonly keys: SchedulingItem.Keys;

  constructor(private readonly attr: SchedulingItem.Attributes) {
    this.keys = {
      PK: SchedulingItem.getPK(attr.barber.id),
      SK: SchedulingItem.getSK(attr.date, attr.startTime),

      GS1PK: SchedulingItem.getGS1PK(attr.accountId),
      GS1SK: SchedulingItem.getGS1SK(attr.date, attr.startTime),
    };
  }

  toItem(): SchedulingItem.ItemTypes {
    return {
      ...this.keys,
      ...this.attr,
      type: SchedulingItem.type,
    };
  }

  static fromEntity(scheduling: Scheduling) {
    return new SchedulingItem({
      ...scheduling,
      createdAt: scheduling.createdAt.toISOString(),
    });
  }

  static toEntity(item: SchedulingItem.ItemTypes) {
    return new Scheduling({
      ...item,
      createdAt: new Date(item.createdAt),
    });
  }

  static getPK(barberId: string): SchedulingItem.Keys["PK"] {
    return `BARBER#${barberId}`;
  }

  static getSK(date: string, startTime: string): SchedulingItem.Keys["SK"] {
    return `SCHEDULING#${date}#${startTime}`;
  }

  static getGS1PK(accountId: string): SchedulingItem.Keys["GS1PK"] {
    return `ACCOUNT#${accountId}`;
  }
  static getGS1SK(
    date: string,
    startTime: string,
  ): SchedulingItem.Keys["GS1SK"] {
    return `SCHEDULING#${date}#${startTime}`;
  }
}

export namespace SchedulingItem {
  export type Keys = {
    PK: `BARBER#${string}`;
    SK: `SCHEDULING#${string}#${string}`;
    GS1PK: `ACCOUNT#${string}`;
    GS1SK: `SCHEDULING#${string}#${string}`;
  };

  export type Status =
    | "SCHEDULED"
    | "CONFIRMED"
    | "CANCELLED"
    | "COMPLETED"
    | "NO_SHOW";

  export type Attributes = {
    id: string;

    barber: Barber;
    barbershop: Barbershop;
    service: Service;
    accountId: string;
    date: string;
    startTime: string;
    endTime: string;

    status?: Status;

    createdAt: string;
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
  export type ItemTypes = Keys &
    Attributes & {
      type: "Scheduling";
    };
}
