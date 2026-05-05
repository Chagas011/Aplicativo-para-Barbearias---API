import { ServiceRepository } from "@/infra/database/dynamo/repositories/ServiceRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class DeleteServiceUseCase {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async execute({
    accountId,
    serviceId,
    barberId,
  }: DeleteServiceUseCase.Input): Promise<DeleteServiceUseCase.Output> {
    await this.serviceRepository.delete(accountId, serviceId, barberId);
  }
}

export namespace DeleteServiceUseCase {
  export type Input = {
    accountId: string;
    serviceId: string;
    barberId: string;
  };

  export type Output = void;
}
