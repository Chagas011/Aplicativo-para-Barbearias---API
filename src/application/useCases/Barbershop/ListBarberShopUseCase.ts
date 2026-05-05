import { Barbershop } from "@/application/entites/BarberShop";
import { BarbershopRepository } from "@/infra/database/dynamo/repositories/BarbershopRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class ListBarberShopUseCase {
  constructor(private readonly barberShopRepository: BarbershopRepository) {}

  async execute(): Promise<ListBarberShopUseCase.Output> {
    const barberShop = await this.barberShopRepository.listAll();

    return { barberShop };
  }
}

export namespace ListBarberShopUseCase {
  export type Output = {
    barberShop: Barbershop[];
  };
}
