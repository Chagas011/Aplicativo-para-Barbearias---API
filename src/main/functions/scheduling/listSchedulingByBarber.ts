import "reflect-metadata";

import { ListSchedulingByBarberController } from "@/application/controllers/scheduling/ListSchedulingByBarberController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(ListSchedulingByBarberController);
