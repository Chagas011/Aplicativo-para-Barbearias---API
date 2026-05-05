import "reflect-metadata";

import { ListServiceByBarberController } from "@/application/controllers/service/ListServiceByBarberController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(ListServiceByBarberController);
