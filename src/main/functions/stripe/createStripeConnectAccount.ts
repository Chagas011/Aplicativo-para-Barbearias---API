import "reflect-metadata";

import { CreateStripeConnectAccountController } from "@/application/controllers/stripe/CreateStripeConnectAccountController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(CreateStripeConnectAccountController);
