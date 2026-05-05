import { Barber } from "@/application/entites/Barber";
import { ResouceNotFound } from "@/application/errors/application/ResourceNotFound";
import { BarberRepository } from "@/infra/database/dynamo/repositories/BarberRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class GetBarberByIdUseCase {
  constructor(private readonly barberRepository: BarberRepository) {}

  async execute({
    barberId,
    barbershopId,
  }: GetBarberByIdUseCase.Input): Promise<GetBarberByIdUseCase.Output> {
    const barber = await this.barberRepository.findById(barbershopId, barberId);
    if (!barber) {
      throw new ResouceNotFound();
    }
    return {
      barber,
    };
  }
}

export namespace GetBarberByIdUseCase {
  export type Input = {
    barberId: string;
    barbershopId: string;
  };

  export type Output = {
    barber: Barber;
  };
}
