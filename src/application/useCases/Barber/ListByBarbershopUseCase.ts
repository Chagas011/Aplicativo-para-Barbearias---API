import { Barber } from "@/application/entites/Barber";
import { ResouceNotFound } from "@/application/errors/application/ResourceNotFound";
import { BarberRepository } from "@/infra/database/dynamo/repositories/BarberRepository";
import { BarbershopRepository } from "@/infra/database/dynamo/repositories/BarbershopRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class ListByBarbershopUseCase {
  constructor(
    private readonly barberRepository: BarberRepository,
    private readonly barberShopRepository: BarbershopRepository,
  ) {}

  async execute({
    barbershopId,
  }: ListByBarbershopUseCase.Input): Promise<ListByBarbershopUseCase.Output> {
    const barbershopIsExist =
      await this.barberShopRepository.findById(barbershopId);
    if (!barbershopIsExist) {
      throw new ResouceNotFound();
    }

    const barber = await this.barberRepository.listByBarbershop(barbershopId);
    return {
      barber,
    };
  }
}

export namespace ListByBarbershopUseCase {
  export type Input = {
    barbershopId: string;
  };

  export type Output = {
    barber: Barber[];
  };
}
