import { Service } from "@/application/entites/Service";

export class ServiceItem {
  static readonly type = "Service";

  private readonly keys: ServiceItem.Keys;

  constructor(private readonly attr: ServiceItem.Attributes) {
    this.keys = {
      PK: ServiceItem.getPK(attr.barberId),
      SK: ServiceItem.getSK(attr.id),
    };
  }

  toItem(): ServiceItem.ItemTypes {
    return {
      ...this.keys,
      ...this.attr,
      type: ServiceItem.type,
    };
  }

  static fromEntity(service: Service) {
    return new ServiceItem({
      ...service,
      createdAt: service.createdAt.toISOString(),
    });
  }

  static toEntity(item: ServiceItem.ItemTypes) {
    return new Service({
      id: item.id,
      name: item.name,
      duration: item.duration,
      price: item.price,
      accountId: item.accountId,
      isActive: item.isActive,
      barberId: item.barberId,
      photoURL: item.photoURL,
      createdAt: new Date(item.createdAt),
    });
  }

  static getPK(barberId: string): ServiceItem.Keys["PK"] {
    return `BARBER#${barberId}`;
  }

  static getSK(serviceId: string): ServiceItem.Keys["SK"] {
    return `SERVICE#${serviceId}`;
  }
}

export namespace ServiceItem {
  export type Keys = {
    PK: `BARBER#${string}`;
    SK: `SERVICE#${string}`;
  };

  export type Attributes = {
    id: string;
    accountId: string;
    name: string;
    duration: number;
    price: number;
    isActive: boolean;
    barberId: string;
    photoURL?: string | null;
    createdAt: string;
  };

  export type ItemTypes = Keys &
    Attributes & {
      type: "Service";
    };
}
