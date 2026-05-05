import { Barber } from "@/application/entites/Barber";
import { BarberRepository } from "@/infra/database/dynamo/repositories/BarberRepository";
import { BarbershopStorageGateway } from "@/infra/gateway/BarbershopStorageGateway";
import { Injectable } from "@/kernel/decorators/Injectable";
import { getExtension } from "@/shared/help/getExtension";

@Injectable()
export class CreateBarberUseCase {
  constructor(
    private readonly barberRepository: BarberRepository,
    private readonly barberShopStorageGateway: BarbershopStorageGateway,
  ) {}

  async execute({
    accountId,
    barbershopId,
    name,
    file,
    workingHours,
  }: CreateBarberUseCase.Input): Promise<CreateBarberUseCase.Output> {
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

    const barber = new Barber({
      name,
      barbershopId,
      accountId,
      photoURL,
      workingHours,
    });

    await this.barberRepository.create(barber);

    return {
      barber,
      uploadSignature,
      fileKey,
    };
  }
}

export namespace CreateBarberUseCase {
  export type Input = {
    accountId: string;
    barbershopId: string;
    name: string;
    file?: {
      type: string;
      size: number;
    };
    workingHours: WorkingHours[];
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
