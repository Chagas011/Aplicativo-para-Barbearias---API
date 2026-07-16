import { z } from "zod";

export const createSchedulingSchema = z.object({
  serviceId: z.string().min(1, "serviceId is required"),

  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),

  startTime: z.string().regex(/^\d{2}:\d{2}$/, "startTime must be HH:mm"),
});

export type CreateSchedulingBody = z.infer<typeof createSchedulingSchema>;
