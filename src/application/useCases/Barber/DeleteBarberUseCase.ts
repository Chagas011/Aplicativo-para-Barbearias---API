import { BarberRepository } from "@/infra/database/dynamo/repositories/BarberRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class DeleteBarberUseCase {
  constructor(private readonly barberRepository: BarberRepository) {}

  async execute({
    barberId,
    barbershopId,
    accountId,
  }: DeleteBarberUseCase.Input): Promise<DeleteBarberUseCase.Output> {
    await this.barberRepository.delete(barbershopId, barberId, accountId);
  }
}

export namespace DeleteBarberUseCase {
  export type Input = {
    barbershopId: string;
    barberId: string;
    accountId: string;
  };

  export type Output = void;
}
