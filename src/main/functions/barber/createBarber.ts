import "reflect-metadata";

import { CreateBarberController } from "@/application/controllers/barber/CreateBarberController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(CreateBarberController);
