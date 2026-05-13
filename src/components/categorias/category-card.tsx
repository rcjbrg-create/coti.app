import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import type { Category } from "@/types/dish";
import { UtensilsCrossed } from "lucide-react";

interface Props {
  category: Category;
}

export function CategoryCard({ category }: Props) {
  return (
    <Link href={`/categorias/${category.slug}`}>
      <Card hoverable className="group overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden bg-beige-dark flex items-center justify-center">
          {category.cover_image_path ? (
            <Image
              src={category.cover_image_path}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <UtensilsCrossed size={40} className="text-text-muted/40" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardContent className="relative">
          <h3 className="font-semibold text-text text-sm group-hover:text-primary transition-colors">{category.name}</h3>
          {category.description && (
            <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{category.description}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
