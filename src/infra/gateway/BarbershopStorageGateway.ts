import { Injectable } from "@/kernel/decorators/Injectable";

import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { randomUUID } from "node:crypto";

import { AppConfig } from "@/shared/config/Appconfig";
import { s3Client } from "../clients/s3Client";

@Injectable()
export class BarbershopStorageGateway {
  constructor(private readonly config: AppConfig) {}

  static generateInputFileKey({
    accountId,
    extension,
  }: BarbershopStorageGateway.GenerateInputFileKey): string {
    const fileName = `${randomUUID()}.${extension}`;

    return `barbershop/${accountId}/${fileName}`;
  }

  getFileURL(fileKey: string) {
    const cdn = this.config.cdn.barbershopCDN;

    return `https://${cdn}/${fileKey}`;
  }

  async createPOST({
    file,
    filekey,
    accountId,
  }: BarbershopStorageGateway.CreatePOSTParams): Promise<BarbershopStorageGateway.CreatePOSTResult> {
    const bucket = this.config.storage.barbershopBucket;
    const contentType = file.type;

    const { fields, url } = await createPresignedPost(s3Client, {
      Bucket: bucket,
      Key: filekey,
      Expires: 5 * 60,

      Conditions: [
        { bucket },
        ["eq", "$key", filekey],
        ["eq", "$Content-Type", contentType],
        ["content-length-range", file.size, file.size],
      ],

      Fields: {
        "x-amz-meta-accountid": accountId,
      },
    });

    const uploadSignature = Buffer.from(
      JSON.stringify({
        fields: {
          ...fields,
          "Content-Type": contentType,
        },
        url,
      }),
    ).toString("base64");

    return { uploadSignature };
  }
}

export namespace BarbershopStorageGateway {
  export type GenerateInputFileKey = {
    accountId: string;
    extension: string;
  };

  export type CreatePOSTParams = {
    accountId: string;
    filekey: string;
    file: {
      size: number;
      type: string;
    };
  };

  export type CreatePOSTResult = {
    uploadSignature: string;
  };
}
