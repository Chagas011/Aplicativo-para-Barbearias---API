import { Barber } from "@/application/entites/Barber";

export class BarberItem {
  static readonly type = "Barber";

  private readonly keys: BarberItem.Keys;

  constructor(private readonly attr: BarberItem.Attributes) {
    this.keys = {
      PK: BarberItem.getPK(attr.barbershopId),
      SK: BarberItem.getSK(attr.id),
    };
  }

  toItem(): BarberItem.ItemTypes {
    return {
      ...this.keys,
      ...this.attr,
      type: BarberItem.type,
    };
  }

  static fromEntity(barber: Barber) {
    return new BarberItem({
      ...barber,
      createdAt: barber.createdAt.toISOString(),
    });
  }

  static toEntity(item: BarberItem.ItemTypes) {
    return new Barber({
      id: item.id,
      barbershopId: item.barbershopId,
      accountId: item.accountId,
      name: item.name,
      photoURL: item.photoURL,
      workingHours: item.workingHours,
      createdAt: new Date(item.createdAt),
    });
  }

  static getPK(barberShopId: string): BarberItem.Keys["PK"] {
    return `BARBERSHOP#${barberShopId}`;
  }

  static getSK(barberId: string): BarberItem.Keys["SK"] {
    return `BARBER#${barberId}`;
  }
}

export namespace BarberItem {
  export type Keys = {
    PK: `BARBERSHOP#${string}`;
    SK: `BARBER#${string}`;
  };

  export type Attributes = {
    id: string;
    barbershopId: string;
    name: string;
    photoURL?: string | null;
    createdAt: string;
    accountId: string;
    workingHours: WorkingHours[];
  };

  export type WorkingHours = {
    dayOfWeek: number;
    start: string;
    end: string;
  };
  export type ItemTypes = Keys &
    Attributes & {
      type: "Barber";
    };
}
