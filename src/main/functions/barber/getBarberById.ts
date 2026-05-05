import "reflect-metadata";

import { GetBarberByIdController } from "@/application/controllers/barber/GetBarberByIdController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(GetBarberByIdController);
