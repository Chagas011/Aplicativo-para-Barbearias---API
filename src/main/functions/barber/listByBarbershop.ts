import "reflect-metadata";

import { ListByBarbershopController } from "@/application/controllers/barber/ListByBarbershopController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(ListByBarbershopController);
