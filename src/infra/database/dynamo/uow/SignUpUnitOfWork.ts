import { Account } from "@/application/entites/Account";

import { Injectable } from "@/kernel/decorators/Injectable";
import { AccountRepository } from "../repositories/AccountRepository";
import { UnitOfWork } from "./UnitOfWork";

@Injectable()
export class SignUpUnitOfWork extends UnitOfWork {
  constructor(private readonly accountRepository: AccountRepository) {
    super();
  }
  async run({ account }: SignUpUnitOfWork.RunParams) {
    this.addPut(this.accountRepository.getPutCommandInput(account));

    await this.commit();
  }
}

export namespace SignUpUnitOfWork {
  export type RunParams = {
    account: Account;
  };
}
