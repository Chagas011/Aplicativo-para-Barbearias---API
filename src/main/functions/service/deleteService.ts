import "reflect-metadata";

import { DeleteServiceController } from "@/application/controllers/service/DeleteServiceController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(DeleteServiceController);
