import { z } from "zod";
const MAX_FILE_IN_MBS = 10 * 1024 * 1024;

export const baseBarbershopSchema = z.object({
  name: z.string().min(3, "Nome da barbearia deve ter pelo menos 3 caracteres"),

  phone: z.string().min(1, "Telefone inválido").max(20),
  file: z
    .object({
      type: z.enum(["image/jpeg", "image/png"]),
      size: z
        .number()
        .min(1, "size is required")
        .max(MAX_FILE_IN_MBS, "The file should have up to 10MB"),
    })
    .optional(),
  address: z.object({
    street: z.string().min(2),
    number: z.string().min(1),
    city: z.string().min(2),
    state: z.string().length(2),
    zipCode: z.string().min(8).max(9),
  }),
  socialMedia: z
    .array(
      z.object({
        name: z.string().min(1),
        url: z.string().min(1),
      }),
    )
    .optional(),
  openingHours: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      open: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
      close: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    }),
  ),
});

export const updateBarbershopSchema = baseBarbershopSchema.partial();
export type UpdateBarbershopBody = z.infer<typeof updateBarbershopSchema>;
