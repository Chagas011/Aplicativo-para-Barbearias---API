import "reflect-metadata";

import { UpdateBarberController } from "@/application/controllers/barber/UpdateBarberController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(UpdateBarberController);
