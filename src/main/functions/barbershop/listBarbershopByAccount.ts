import "reflect-metadata";

import { ListBarbershopByAccountController } from "@/application/controllers/barberShop/ListBarbershopByAccountController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(ListBarbershopByAccountController);
