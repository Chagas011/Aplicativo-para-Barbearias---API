import "reflect-metadata";

import { DeleteBarbershopController } from "@/application/controllers/barberShop/DeleteBarbershopController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(DeleteBarbershopController);
