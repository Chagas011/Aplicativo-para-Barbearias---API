import KSUID from "ksuid";

export class Barbershop {
  readonly id: string;
  readonly accountId: string;
  name: string;
  phone: string;

  address: Barbershop.Address;

  photoURL?: string | null;
  socialMedia?: Barbershop.SocialMedia[];
  openingHours: Barbershop.OpeningHours[];

  readonly createdAt: Date;

  constructor(attr: Barbershop.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.accountId = attr.accountId;
    this.name = attr.name;
    this.phone = attr.phone;
    this.socialMedia = attr.socialMedia;
    this.address = attr.address;

    this.photoURL = attr.photoURL ?? null;

    this.openingHours = attr.openingHours;

    this.createdAt = attr.createdAt ?? new Date();
  }
}

export namespace Barbershop {
  export type Attributes = {
    id?: string;
    accountId: string;
    name: string;
    phone: string;
    address: Address;
    socialMedia?: SocialMedia[];
    photoURL?: string | null;
    openingHours: OpeningHours[];
    createdAt?: Date;
  };

  export type Address = {
    street: string;
    number: string;
    city: string;
    state: string;
    zipCode: string;
  };
  export type SocialMedia = {
    name: string;
    url: string;
  };

  export type OpeningHours = {
    dayOfWeek: number;
    open: string;
    close: string;
  };
}
