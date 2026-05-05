import { Service } from "@/application/entites/Service";
import { ServiceRepository } from "@/infra/database/dynamo/repositories/ServiceRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class ListServiceByBarberUseCase {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async execute({
    barberId,
  }: ListServiceByBarberUseCase.Input): Promise<ListServiceByBarberUseCase.Output> {
    const service = await this.serviceRepository.listByBarber(barberId);
    return {
      service,
    };
  }
}

export namespace ListServiceByBarberUseCase {
  export type Input = {
    barberId: string;
  };

  export type Output = {
    service: Service[];
  };
}
