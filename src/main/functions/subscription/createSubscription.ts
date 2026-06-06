import "reflect-metadata";

import { CreateSubscriptionController } from "@/application/controllers/subscription/CreateSubscriptionController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(CreateSubscriptionController);
