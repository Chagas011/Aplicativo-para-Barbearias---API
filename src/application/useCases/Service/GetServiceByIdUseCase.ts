import { Service } from "@/application/entites/Service";
import { ResouceNotFound } from "@/application/errors/application/ResourceNotFound";
import { ServiceRepository } from "@/infra/database/dynamo/repositories/ServiceRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class GetServiceByIdUseCase {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async execute({
    barberId,
    serviceId,
  }: GetServiceByIdUseCase.Input): Promise<GetServiceByIdUseCase.Output> {
    const service = await this.serviceRepository.findById(barberId, serviceId);
    if (!service) {
      throw new ResouceNotFound();
    }
    return {
      service,
    };
  }
}

export namespace GetServiceByIdUseCase {
  export type Input = {
    barberId: string;
    serviceId: string;
  };

  export type Output = {
    service: Service;
  };
}
