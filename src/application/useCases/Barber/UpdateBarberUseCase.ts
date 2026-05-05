import { Barber } from "@/application/entites/Barber";
import { ResouceNotFound } from "@/application/errors/application/ResourceNotFound";
import { BarberRepository } from "@/infra/database/dynamo/repositories/BarberRepository";
import { BarbershopStorageGateway } from "@/infra/gateway/BarbershopStorageGateway";
import { Injectable } from "@/kernel/decorators/Injectable";
import { getExtension } from "@/shared/help/getExtension";

@Injectable()
export class UpdateBarberUseCase {
  constructor(
    private readonly barberRepository: BarberRepository,
    private readonly barberShopStorageGateway: BarbershopStorageGateway,
  ) {}

  async execute({
    accountId,
    barberId,
    barbershopId,
    name,
    file,
    workingHours,
  }: UpdateBarberUseCase.Input): Promise<UpdateBarberUseCase.Output> {
    const barber = await this.barberRepository.findById(barbershopId, barberId);

    if (!barber) {
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
    barber.name = name ?? barber.name;
    barber.photoURL = photoURL ?? barber.photoURL;
    barber.workingHours = workingHours ?? barber.workingHours;
    await this.barberRepository.save(barber);

    return {
      barber,
      uploadSignature,
      fileKey,
    };
  }
}

export namespace UpdateBarberUseCase {
  export type Input = {
    accountId: string;
    barberId: string;
    barbershopId: string;
    name?: string;
    file?: {
      type: string;
      size: number;
    };
    workingHours?: WorkingHours[];
  };

  export type WorkingHours = {
    dayOfWeek: number;
    start: string;
    end: string;
  };

  export type Output = {
    barber: Barber;
    uploadSignature?: string;
    fileKey?: string;
  };
}
