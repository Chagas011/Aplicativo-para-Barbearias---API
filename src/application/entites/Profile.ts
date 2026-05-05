export class Profile {
  readonly accountId: string;
  photoURL?: string | null;

  readonly createdAt: Date;

  constructor(attr: Profile.Attributes) {
    this.accountId = attr.accountId;
    this.photoURL = attr.photoURL;

    this.createdAt = attr.createdAt ?? new Date();
  }
}

export namespace Profile {
  export type Attributes = {
    accountId: string;
    photoURL?: string | null;
    createdAt?: Date;
  };
}
