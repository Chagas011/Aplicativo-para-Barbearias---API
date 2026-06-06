import { z } from "zod";

export const planNameEnum = z.enum(["BASIC", "PREMIUM"]);

export const createSubscriptionSchema = z.object({
  planName: planNameEnum,
});

export type CreateSubscriptionBody = z.infer<typeof createSubscriptionSchema>;
