import "reflect-metadata";

import { UpdateServiceController } from "@/application/controllers/service/UpdateServiceController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(UpdateServiceController);
