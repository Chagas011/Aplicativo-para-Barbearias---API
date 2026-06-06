import "reflect-metadata";

import { DeletePlanController } from "@/application/controllers/plan/DeletePlanController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(DeletePlanController);
