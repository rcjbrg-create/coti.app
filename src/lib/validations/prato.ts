import { z } from "zod";

export const ingredienteSchema = z.object({
  ingredient_name: z.string().min(1, "Nome do ingrediente é obrigatório"),
  quantity: z.coerce.number().min(0, "Quantidade inválida"),
  unit: z.string().min(1, "Unidade é obrigatória"),
  preparation_note: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v?.trim() || null),
});

export const passoSchema = z.object({
  title: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v?.trim() || null),
  instruction: z.string().min(1, "Instrução é obrigatória"),
  time_hint: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v?.trim() || null),
});

export const pratoSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  category_id: z.string().uuid("Selecione uma categoria válida"),
  station_id: z.string().uuid("Selecione uma praça válida"),
  short_description: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v?.trim() || null),
  yield_info: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v?.trim() || null),
  plating_notes: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v?.trim() || null),
  prep_time_minutes: z.coerce.number().int().min(0).nullable().optional(),
  is_published: z.boolean().default(false),
});

export type PratoInput = z.infer<typeof pratoSchema>;
export type IngredienteInput = z.infer<typeof ingredienteSchema>;
export type PassoInput = z.infer<typeof passoSchema>;
