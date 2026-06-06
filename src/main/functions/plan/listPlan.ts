import "reflect-metadata";

import { ListPlanController } from "@/application/controllers/plan/ListPlanController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(ListPlanController);
