import KSUID from "ksuid";

export class Service {
  readonly id: string;
  readonly barberId: string;
  readonly accountId: string;
  photoURL?: string | null;
  name: string;
  duration: number;
  price: number;
  isActive: boolean;
  readonly createdAt: Date;

  constructor(attr: Service.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.accountId = attr.accountId;
    this.photoURL = attr.photoURL;
    this.name = attr.name;
    this.price = attr.price;
    this.barberId = attr.barberId;
    this.duration = attr.duration;
    this.isActive = attr.isActive ?? true;
    this.createdAt = attr.createdAt ?? new Date();
  }
}

export namespace Service {
  export type Attributes = {
    id?: string;
    accountId: string;
    barberId: string;
    name: string;
    duration: number;
    price: number;
    isActive: boolean;
    photoURL?: string | null;
    createdAt?: Date;
  };
}
