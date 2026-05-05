import { Barbershop } from "@/application/entites/BarberShop";

export class BarbershopItem {
  static readonly type = "Barbershop";

  private readonly keys: BarbershopItem.Keys;

  constructor(private readonly attr: BarbershopItem.Attributes) {
    this.keys = {
      PK: BarbershopItem.getPK(this.attr.id),
      SK: BarbershopItem.getSK(this.attr.id),

      GS1PK: BarbershopItem.getGS1PK(),
      GS1SK: BarbershopItem.getGS1SK(this.attr.id),

      GS2PK: BarbershopItem.getGS2PK(this.attr.accountId),
      GS2SK: BarbershopItem.getGS1SK(this.attr.id),
    };
  }

  toItem(): BarbershopItem.ItemTypes {
    return {
      ...this.keys,
      ...this.attr,
      type: BarbershopItem.type,
    };
  }

  static fromEntity(barbershop: Barbershop) {
    return new BarbershopItem({
      ...barbershop,
      createdAt: barbershop.createdAt.toISOString(),
    });
  }

  static toEntity(item: BarbershopItem.ItemTypes) {
    return new Barbershop({
      id: item.id,
      accountId: item.accountId,
      name: item.name,
      phone: item.phone,
      photoURL: item.photoURL,
      address: item.address,
      socialMedia: item.socialMedia,
      openingHours: item.openingHours,
      createdAt: new Date(item.createdAt),
    });
  }

  static getPK(id: string): BarbershopItem.Keys["PK"] {
    return `BARBERSHOP#${id}`;
  }

  static getSK(id: string): BarbershopItem.Keys["SK"] {
    return `BARBERSHOP#${id}`;
  }

  static getGS1PK(): BarbershopItem.Keys["GS1PK"] {
    return "BARBERSHOP";
  }

  static getGS1SK(id: string): BarbershopItem.Keys["GS1SK"] {
    return `BARBERSHOP#${id}`;
  }

  static getGS2PK(accountId: string): BarbershopItem.Keys["GS2PK"] {
    return `ACCOUNT#${accountId}`;
  }

  static getGS2SK(id: string): BarbershopItem.Keys["GS2SK"] {
    return `BARBERSHOP#${id}`;
  }
}

export namespace BarbershopItem {
  export type Keys = {
    PK: `BARBERSHOP#${string}`;
    SK: `BARBERSHOP#${string}`;

    GS1PK: "BARBERSHOP";
    GS1SK: `BARBERSHOP#${string}`;

    GS2PK: `ACCOUNT#${string}`;
    GS2SK: `BARBERSHOP#${string}`;
  };

  export type Attributes = {
    id: string;
    name: string;
    phone: string;
    accountId: string;
    photoURL?: string | null;

    address: {
      street: string;
      number: string;
      city: string;
      state: string;
      zipCode: string;
    };
    socialMedia?: {
      name: string;
      url: string;
    }[];
    openingHours: {
      dayOfWeek: number;
      open: string;
      close: string;
    }[];

    createdAt: string;
  };

  export type ItemTypes = Keys &
    Attributes & {
      type: "Barbershop";
    };
}
