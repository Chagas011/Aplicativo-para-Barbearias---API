import { Account } from "@/application/entites/Account";
import { EmailAlreadyInUse } from "@/application/errors/application/EmailAlreadyInUse";
import { AccountRepository } from "@/infra/database/dynamo/repositories/AccountRepository";
import { SignUpUnitOfWork } from "@/infra/database/dynamo/uow/SignUpUnitOfWork";
import { AuthGateway } from "@/infra/gateway/AuthGateway";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class SignUpClientUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly accountRepository: AccountRepository,

    private readonly signUpUow: SignUpUnitOfWork,
  ) {}

  async execute({
    account: { email, password, name },
  }: SignUpClientUseCase.Input): Promise<SignUpClientUseCase.OutPut> {
    const emailAlreadyExist = await this.accountRepository.findEmail(email);
    if (emailAlreadyExist) {
      throw new EmailAlreadyInUse();
    }

    const account = new Account({ email, name });

    const { externalId } = await this.authGateway.singnUp({
      email,
      password,
      internalId: account.id,
      name,
    });
    await this.authGateway.addUserToGroup({
      email,
      groupName: "client",
    });
    try {
      account.externalId = externalId;

      await this.signUpUow.run({
        account,
      });

      const { accessToken, refreshToken } = await this.authGateway.singnIn({
        email,
        password,
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      await this.authGateway.deleteUser({ externalId });
      throw error;
    }
  }
}

export namespace SignUpClientUseCase {
  export type Input = {
    account: {
      email: string;
      password: string;
      name: string;
    };
  };

  export type OutPut = {
    accessToken: string;
    refreshToken: string;
  };
}
