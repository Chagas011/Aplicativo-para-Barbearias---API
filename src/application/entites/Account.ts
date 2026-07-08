import KSUID from "ksuid";
export class Account {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  externalId: string | undefined;
  readonly createdAt: Date;
  stripeConnectAccountId?: string;

  constructor(attr: Account.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.email = attr.email;
    this.name = attr.name;
    this.externalId = attr.externalId;
    this.createdAt = attr.createdAt ?? new Date();
    this.stripeConnectAccountId = attr.stripeConnectAccountId;
  }
}

export namespace Account {
  export type Attributes = {
    email: string;
    name: string;
    externalId?: string;
    id?: string;
    createdAt?: Date;
    stripeConnectAccountId?: string;
  };
}
