import "reflect-metadata";

import { CreateClientCheckoutSessionController } from "@/application/controllers/subscriptionClient/CreateClientCheckoutSessionController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(CreateClientCheckoutSessionController);
