import "reflect-metadata";

import { CreateServiceController } from "@/application/controllers/service/CreateServiceController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(CreateServiceController);
