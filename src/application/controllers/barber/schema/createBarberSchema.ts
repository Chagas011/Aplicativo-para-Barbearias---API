import { z } from "zod";

const MAX_FILE_IN_MBS = 10 * 1024 * 1024;

export const createBarberSchema = z.object({
  barbershopId: z.string().min(1),

  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),

  workingHours: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
      end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    }),
  ),
  file: z
    .object({
      type: z.enum(["image/jpeg", "image/png"]),
      size: z.number().min(1).max(MAX_FILE_IN_MBS, "Arquivo deve ter até 10MB"),
    })
    .optional(),
});

export type CreateBarberBody = z.infer<typeof createBarberSchema>;
