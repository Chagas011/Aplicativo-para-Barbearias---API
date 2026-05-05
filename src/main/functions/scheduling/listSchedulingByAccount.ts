import "reflect-metadata";

import { ListSchedulingByAccountController } from "@/application/controllers/scheduling/ListSchedulingByAccountController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(ListSchedulingByAccountController);
