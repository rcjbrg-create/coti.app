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
      <Card hoverable>
        <div className="relative aspect-[4/3] overflow-hidden bg-beige-dark flex items-center justify-center">
          {category.cover_image_path ? (
            <Image
              src={category.cover_image_path}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              loading="lazy"
            />
          ) : (
            <UtensilsCrossed size={40} className="text-text-muted/40" />
          )}
        </div>
        <CardContent>
          <h3 className="font-semibold text-text text-sm">{category.name}</h3>
          {category.description && (
            <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{category.description}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
