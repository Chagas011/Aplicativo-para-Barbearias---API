import { Account } from "@/application/entites/Account";
import { ResouceNotFound } from "@/application/errors/application/ResourceNotFound";
import { AccountRepository } from "@/infra/database/dynamo/repositories/AccountRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class GetMeUseCase {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute({
    accountId,
  }: GetMeUseCase.Input): Promise<GetMeUseCase.Output> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new ResouceNotFound();
    }
    return {
      account,
    };
  }
}

export namespace GetMeUseCase {
  export type Input = {
    accountId: string;
  };

  export type Output = {
    account: Account;
  };
}
