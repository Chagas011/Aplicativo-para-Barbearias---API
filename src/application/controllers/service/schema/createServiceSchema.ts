import { z } from "zod";

const MAX_FILE_IN_MBS = 10 * 1024 * 1024;

export const createServiceSchema = z.object({
  barberId: z.string().min(1),
  name: z.string().min(3, "Nome do serviço deve ter pelo menos 3 caracteres"),
  duration: z.number().min(5),
  price: z.number().min(1),
  isActive: z.boolean(),
  file: z
    .object({
      type: z.enum(["image/jpeg", "image/png"]),
      size: z
        .number()
        .min(1)
        .max(MAX_FILE_IN_MBS, "O arquivo deve ter no máximo 10MB"),
    })
    .optional(),
});

export type CreateServiceBody = z.infer<typeof createServiceSchema>;
