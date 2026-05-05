import "reflect-metadata";

import { UpdateBarberShopController } from "@/application/controllers/barberShop/UpdateBarberShopController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(UpdateBarberShopController);
