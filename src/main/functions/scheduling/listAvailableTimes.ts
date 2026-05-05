import "reflect-metadata";

import { ListAvailableTimesController } from "@/application/controllers/scheduling/ListAvailableTimeController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(ListAvailableTimesController);
