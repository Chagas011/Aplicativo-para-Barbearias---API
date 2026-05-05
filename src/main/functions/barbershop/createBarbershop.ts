import "reflect-metadata";

import { CreateBarbershopController } from "@/application/controllers/barberShop/CreateBarberShopController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(CreateBarbershopController);
