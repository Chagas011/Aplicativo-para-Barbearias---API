import "reflect-metadata";

import { ListSubscriptionClientController } from "@/application/controllers/subscriptionClient/ListSubscriptionClientController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(ListSubscriptionClientController);
