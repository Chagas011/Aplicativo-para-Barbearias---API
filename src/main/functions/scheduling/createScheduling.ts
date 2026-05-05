import "reflect-metadata";

import { CreateSchedulingController } from "@/application/controllers/scheduling/CreateSchedulingController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(CreateSchedulingController);
