import "reflect-metadata";

import { CreatePlanController } from "@/application/controllers/plan/CreatePlanController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(CreatePlanController);
