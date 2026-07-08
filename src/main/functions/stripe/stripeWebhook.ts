import "reflect-metadata";

import { StripeWebhookController } from "@/application/controllers/stripe/StripeWebhookController";
import { lambdaHttpAdapter } from "@/main/adapter/lambdaHttpAdapter";

export const handler = lambdaHttpAdapter(StripeWebhookController);
