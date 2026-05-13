import { z } from "zod";

export const categoriaSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z
    .string()
    .optional()
    .transform((v) => {
      const trimmed = v?.trim();
      return trimmed || null;
    }),
  display_order: z.coerce.number().int().min(0).default(0),
});

export type CategoriaInput = z.infer<typeof categoriaSchema>;
