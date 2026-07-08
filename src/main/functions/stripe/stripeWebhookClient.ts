import "reflect-metadata";

import { StripeWebhookClientController } from "@/application/controllers/stripe/StripeWebhookClientController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(StripeWebhookClientController);
