import "reflect-metadata";

import { GetBarbershopByIdController } from "@/application/controllers/barberShop/GetBarbershopByIdController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(GetBarbershopByIdController);
