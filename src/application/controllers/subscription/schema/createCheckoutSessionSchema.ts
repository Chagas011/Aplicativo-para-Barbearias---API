import { z } from "zod";
export const planNameEnum = z.enum(["BASIC", "PREMIUM"]);
export const createCheckoutSessionSchema = z.object({
  planName: planNameEnum,
});

export type CreateCheckoutSessionBody = z.infer<
  typeof createCheckoutSessionSchema
>;
