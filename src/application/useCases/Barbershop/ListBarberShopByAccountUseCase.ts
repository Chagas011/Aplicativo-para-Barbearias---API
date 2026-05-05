import { Barbershop } from "@/application/entites/BarberShop";
import { BarbershopRepository } from "@/infra/database/dynamo/repositories/BarbershopRepository";
import { Injectable } from "@/kernel/decorators/Injectable";

@Injectable()
export class ListBarberShopByAccountUseCase {
  constructor(private readonly barberShopRepository: BarbershopRepository) {}

  async execute({
    accountId,
  }: ListBarberShopByAccountUseCase.Input): Promise<ListBarberShopByAccountUseCase.Output> {
    const barberShop =
      await this.barberShopRepository.listAllByAccount(accountId);

    return { barberShop };
  }
}

export namespace ListBarberShopByAccountUseCase {
  export type Output = {
    barberShop: Barbershop[];
  };

  export type Input = {
    accountId: string;
  };
}
