import { Barbershop } from "@/application/entites/BarberShop";
import { BarbershopRepository } from "@/infra/database/dynamo/repositories/BarbershopRepository";
import { BarbershopStorageGateway } from "@/infra/gateway/BarbershopStorageGateway";
import { Injectable } from "@/kernel/decorators/Injectable";
import { getExtension } from "@/shared/help/getExtension";

@Injectable()
export class CreateBarberShopUseCase {
  constructor(
    private readonly barberShopRepository: BarbershopRepository,
    private readonly barberShopStorageGateway: BarbershopStorageGateway,
  ) {}

  async execute({
    accountId,
    name,
    address,
    phone,
    openingHours,
    socialMedia,
    file,
  }: CreateBarberShopUseCase.Input): Promise<CreateBarberShopUseCase.Output> {
    if (!file) {
      const barberShop = new Barbershop({
        name,
        accountId,
        address,
        phone,
        openingHours,
      });
      await this.barberShopRepository.create(barberShop);
      return {
        barberShop,
      };
    }

    const extension = getExtension(file.type);
    const fileKey = BarbershopStorageGateway.generateInputFileKey({
      accountId,
      extension,
    });

    const { uploadSignature } = await this.barberShopStorageGateway.createPOST({
      accountId,
      filekey: fileKey,
      file: {
        size: file.size,
        type: file.type,
      },
    });

    const barberShop = new Barbershop({
      accountId,
      address,
      name,
      openingHours,
      phone,
      socialMedia,
      photoURL: this.barberShopStorageGateway.getFileURL(fileKey),
    });
    await this.barberShopRepository.create(barberShop);
    return { barberShop, uploadSignature, fileKey };
  }
}

export namespace CreateBarberShopUseCase {
  export type Input = {
    accountId: string;
    name: string;
    address: Address;
    phone: string;
    socialMedia?: SocialMedia[];
    openingHours: OpeningHours[];
    file?: {
      type: string;
      size: number;
    };
  };

  export type Address = {
    street: string;
    number: string;
    city: string;
    state: string;
    zipCode: string;
  };

  export type OpeningHours = {
    dayOfWeek: number;
    open: string;
    close: string;
  };
  export type SocialMedia = {
    name: string;
    url: string;
  };
  export type Output = {
    barberShop: Barbershop;
    uploadSignature?: string;
    fileKey?: string;
  };
}
