import { z } from "zod";

export const pracaSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v?.trim() || null),
  display_order: z.coerce.number().int().min(0).default(0),
});

export type PracaInput = z.infer<typeof pracaSchema>;
