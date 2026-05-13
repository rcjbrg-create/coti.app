export const COLORS = {
  primary: "#1E3A5F",
  primaryLight: "#2563EB",
  accent: "#2563EB",
  beige: "#F5F0E8",
  beigeDark: "#E8E0D0",
  white: "#FFFFFF",
  text: "#1A1A2E",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
} as const;

export const UNITS = [
  "g",
  "kg",
  "ml",
  "l",
  "un",
  "colher (sopa)",
  "colher (cha)",
  "xicara",
  "pitada",
  "a gosto",
] as const;

export const SHIFTS = ["abertura", "producao", "fechamento"] as const;

export const STATIONS_DEFAULT = [
  "Fogao",
  "Garde Manger",
  "Confeitaria",
] as const;
