import "reflect-metadata";

import { ListSubscriptionController } from "@/application/controllers/subscription/ListSubscriptionController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(ListSubscriptionController);
