import "reflect-metadata";

import { CreateCheckoutSessionController } from "@/application/controllers/subscription/CreateCheckoutSessionController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(CreateCheckoutSessionController);
