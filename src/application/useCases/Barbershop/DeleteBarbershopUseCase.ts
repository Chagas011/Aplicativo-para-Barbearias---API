import { BarbershopRepository } from "@/infra/database/dynamo/repositories/BarbershopRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class DeleteBarbershopUseCase {
  constructor(private readonly barbershopRepository: BarbershopRepository) {}

  async execute({
    barbershopId,
    accountId,
  }: DeleteBarbershopUseCase.Input): Promise<DeleteBarbershopUseCase.Output> {
    await this.barbershopRepository.delete(accountId, barbershopId);
  }
}

export namespace DeleteBarbershopUseCase {
  export type Input = {
    barbershopId: string;
    accountId: string;
  };

  export type Output = void;
}
