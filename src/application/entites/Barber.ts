import KSUID from "ksuid";

export class Barber {
  readonly id: string;
  readonly barbershopId: string;
  readonly accountId: string;
  name: string;
  photoURL?: string | null;

  workingHours: Barber.WorkingHours[];

  readonly createdAt: Date;

  constructor(attr: Barber.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.barbershopId = attr.barbershopId;
    this.accountId = attr.accountId;
    this.name = attr.name;
    this.photoURL = attr.photoURL ?? null;

    this.workingHours = attr.workingHours;

    this.createdAt = attr.createdAt ?? new Date();
  }
}

export namespace Barber {
  export type Attributes = {
    id?: string;
    name: string;
    photoURL?: string | null;
    barbershopId: string;
    accountId: string;
    workingHours: WorkingHours[];
    createdAt?: Date;
  };

  export type WorkingHours = {
    dayOfWeek: number;
    start: string;
    end: string;
  };
}
