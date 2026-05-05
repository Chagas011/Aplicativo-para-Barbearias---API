import "reflect-metadata";

import { DeleteBarberController } from "@/application/controllers/barber/DeleteBarberController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(DeleteBarberController);
