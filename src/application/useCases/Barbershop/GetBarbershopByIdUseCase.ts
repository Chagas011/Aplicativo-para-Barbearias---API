import { Barbershop } from "@/application/entites/BarberShop";
import { ResouceNotFound } from "@/application/errors/application/ResourceNotFound";
import { BarbershopRepository } from "@/infra/database/dynamo/repositories/BarbershopRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class GetBarbershopByIdUseCase {
  constructor(private readonly barbershopRepository: BarbershopRepository) {}

  async execute({
    barbershopId,
  }: GetBarbershopByIdUseCase.Input): Promise<GetBarbershopByIdUseCase.Output> {
    const barbershop = await this.barbershopRepository.findById(barbershopId);
    if (!barbershop) {
      throw new ResouceNotFound();
    }
    return {
      barbershop,
    };
  }
}

export namespace GetBarbershopByIdUseCase {
  export type Input = {
    barbershopId: string;
  };

  export type Output = {
    barbershop: Barbershop;
  };
}
