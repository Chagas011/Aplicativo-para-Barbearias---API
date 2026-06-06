import { z } from "zod";

export const createPlanSchema = z.object({
  name: z.string().min(1, "Informe o plano assinado"),
  price: z.number().min(1),
  remaningServices: z.number().min(1),
  services: z.array(z.string().min(1, "Informe um serviço")),
});

export type CreatePlanBody = z.infer<typeof createPlanSchema>;
