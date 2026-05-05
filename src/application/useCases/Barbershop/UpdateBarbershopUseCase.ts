import { Barbershop } from "@/application/entites/BarberShop";
import { ResouceNotFound } from "@/application/errors/application/ResourceNotFound";
import { BarbershopRepository } from "@/infra/database/dynamo/repositories/BarbershopRepository";
import { BarbershopStorageGateway } from "@/infra/gateway/BarbershopStorageGateway";
import { Injectable } from "@/kernel/decorators/Injectable";
import { getExtension } from "@/shared/help/getExtension";

@Injectable()
export class UpdateBarbershopUseCase {
  constructor(
    private readonly barberShopRepository: BarbershopRepository,
    private readonly barberShopStorageGateway: BarbershopStorageGateway,
  ) {}

  async execute({
    accountId,
    barbershopId,
    name,
    address,
    phone,
    openingHours,
    socialMedia,
    file,
  }: UpdateBarbershopUseCase.Input): Promise<UpdateBarbershopUseCase.Output> {
    const barbershop = await this.barberShopRepository.findById(barbershopId);

    if (!barbershop) {
      throw new ResouceNotFound();
    }
    let photoURL: string | undefined;
    let uploadSignature: string | undefined;
    let fileKey: string | undefined;

    if (file) {
      const extension = getExtension(file.type);

      fileKey = BarbershopStorageGateway.generateInputFileKey({
        accountId,
        extension,
      });

      const upload = await this.barberShopStorageGateway.createPOST({
        accountId,
        filekey: fileKey,
        file: {
          size: file.size,
          type: file.type,
        },
      });

      uploadSignature = upload.uploadSignature;
      photoURL = this.barberShopStorageGateway.getFileURL(fileKey);
    }

    barbershop.address = address ?? barbershop.address;
    barbershop.name = name ?? barbershop.name;
    barbershop.openingHours = openingHours ?? barbershop.openingHours;
    barbershop.phone = phone ?? barbershop.phone;
    barbershop.photoURL = photoURL ?? barbershop.photoURL;
    barbershop.socialMedia = socialMedia ?? barbershop.socialMedia;
    await this.barberShopRepository.save(barbershop);
    return { barbershop, uploadSignature, fileKey };
  }
}

export namespace UpdateBarbershopUseCase {
  export type Input = {
    accountId: string;
    barbershopId: string;
    name?: string;
    address?: Address;
    phone?: string;
    socialMedia?: SocialMedia[];
    openingHours?: OpeningHours[];
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
    barbershop: Barbershop;
    uploadSignature?: string;
    fileKey?: string;
  };
}
