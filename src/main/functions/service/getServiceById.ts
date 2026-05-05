import "reflect-metadata";

import { GetServiceByIdController } from "@/application/controllers/service/GetServiceByIdController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(GetServiceByIdController);
