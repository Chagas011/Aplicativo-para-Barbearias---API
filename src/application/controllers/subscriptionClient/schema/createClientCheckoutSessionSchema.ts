import { z } from "zod";

export const createClientCheckoutSessionSchema = z.object({
  planId: z.string().min(1, "PlanId is required"),
  barbershopId: z.string().min(1, "BarbershopId is required"),
});

export type CreateClientCheckoutSessionBody = z.infer<
  typeof createClientCheckoutSessionSchema
>;
