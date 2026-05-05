import { Service } from "@/application/entites/Service";
import { ServiceRepository } from "@/infra/database/dynamo/repositories/ServiceRepository";
import { BarbershopStorageGateway } from "@/infra/gateway/BarbershopStorageGateway";
import { Injectable } from "@/kernel/decorators/Injectable";

import { getExtension } from "@/shared/help/getExtension";

@Injectable()
export class CreateServiceUseCase {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly barberShopStorageGateway: BarbershopStorageGateway,
  ) {}

  async execute({
    accountId,
    barberId,
    name,
    duration,
    price,
    isActive,
    file,
  }: CreateServiceUseCase.Input): Promise<CreateServiceUseCase.Output> {
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

    const service = new Service({
      barberId,
      accountId,
      name,
      duration,
      price,
      isActive,
      photoURL,
    });

    await this.serviceRepository.create(service);

    return {
      service,
      uploadSignature,
      fileKey,
    };
  }
}

export namespace CreateServiceUseCase {
  export type Input = {
    accountId: string;
    barberId: string;
    name: string;
    duration: number;
    price: number;
    isActive: boolean;
    file?: {
      type: string;
      size: number;
    };
  };

  export type Output = {
    service: Service;
    uploadSignature?: string;
    fileKey?: string;
  };
}
