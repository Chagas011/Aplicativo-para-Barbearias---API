import { Service } from "@/application/entites/Service";
import { ResouceNotFound } from "@/application/errors/application/ResourceNotFound";
import { ServiceRepository } from "@/infra/database/dynamo/repositories/ServiceRepository";
import { BarbershopStorageGateway } from "@/infra/gateway/BarbershopStorageGateway";
import { Injectable } from "@/kernel/decorators/Injectable";
import { getExtension } from "@/shared/help/getExtension";

@Injectable()
export class UpdateServiceUseCase {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly barberShopStorageGateway: BarbershopStorageGateway,
  ) {}

  async execute({
    accountId,
    barberId,
    serviceId,
    name,
    duration,
    price,
    isActive,
    file,
  }: UpdateServiceUseCase.Input): Promise<UpdateServiceUseCase.Output> {
    const service = await this.serviceRepository.findById(barberId, serviceId);

    if (!service) {
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

    service.duration = duration ?? service.duration;
    service.isActive = isActive ?? service.isActive;
    service.photoURL = photoURL ?? service.photoURL;
    service.name = name ?? service.name;
    service.price = price ?? service.price;
    await this.serviceRepository.save(service);
    return {
      service,
      uploadSignature,
      fileKey,
    };
  }
}

export namespace UpdateServiceUseCase {
  export type Input = {
    accountId: string;
    barberId: string;
    serviceId: string;
    name?: string;
    duration?: number;
    price?: number;
    isActive?: boolean;
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
