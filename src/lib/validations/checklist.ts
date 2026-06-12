import { z } from "zod";

export const checklistItemSchema = z.object({
  description: z.string().min(1, "Item e obrigatorio"),
});

export const checklistSchema = z.object({
  name: z.string().min(1, "Nome e obrigatorio"),
  sector: z.enum(["cozinha", "salao"]),
  frequency: z.enum(["diario", "semanal", "mensal"]),
  assigned_groups: z.array(z.string()).default([]),
  items: z.array(checklistItemSchema).default([]),
});

export type ChecklistInput = z.infer<typeof checklistSchema>;
export type ChecklistItemInput = z.infer<typeof checklistItemSchema>;
