export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function formatQuantity(quantity: number, unit: string): string {
  const formatted = quantity % 1 === 0 ? quantity.toString() : quantity.toFixed(1);
  return `${formatted} ${unit}`;
}

export function getStorageUrl(bucket: string, path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://facdbydtkqabmxkdcugp.supabase.co";
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}
