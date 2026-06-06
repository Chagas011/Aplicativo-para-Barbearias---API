import "reflect-metadata";

import { UpdatePlanController } from "@/application/controllers/plan/UpdatePlanController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(UpdatePlanController);
