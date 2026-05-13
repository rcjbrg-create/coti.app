import { z } from "zod";

export const checklistItemSchema = z.object({
  item_label: z.string().min(1, "Item é obrigatório"),
  item_description: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v?.trim() || null),
  is_required: z.boolean().default(true),
});

export const checklistSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v?.trim() || null),
  station_id: z.string().uuid("Selecione uma praça válida"),
  shift: z.enum(["abertura", "producao", "fechamento"]),
  items: z.array(checklistItemSchema).default([]),
});

export type ChecklistInput = z.infer<typeof checklistSchema>;
export type ChecklistItemInput = z.infer<typeof checklistItemSchema>;
