import { TechnicalSheet } from "@/components/pratos/technical-sheet";
import { getDishWithDetailsBySlug } from "@/lib/queries/pratos";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DishPage({ params }: Props) {
  const { slug } = await params;

  const detail = await getDishWithDetailsBySlug(slug);
  if (!detail) notFound();

  return (
    <TechnicalSheet
      dish={detail.dish}
      ingredients={detail.ingredients}
      steps={detail.steps}
      media={detail.media}
    />
  );
}
