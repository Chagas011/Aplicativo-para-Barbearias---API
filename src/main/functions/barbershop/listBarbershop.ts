import "reflect-metadata";

import { ListBarbershopController } from "@/application/controllers/barberShop/ListBarbershopController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(ListBarbershopController);
