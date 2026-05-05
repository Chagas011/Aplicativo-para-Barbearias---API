import "reflect-metadata";

import { DeleteSchedulingController } from "@/application/controllers/scheduling/DeleteSchedulingController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(DeleteSchedulingController);
