import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { UtensilsCrossed } from "lucide-react";
import { getStorageUrl } from "@/lib/utils";

interface Props {
  dish: any;
}

export function DishCard({ dish }: Props) {
  const imagePath = dish.hero_image_path || dish.thumbnail_path;
  
  return (
    <Link href={`/pratos/${dish.slug}`}>
      <Card hoverable>
        <div className="relative aspect-[4/3] overflow-hidden bg-beige-dark flex items-center justify-center">
          {imagePath ? (
            <Image
              src={imagePath.startsWith("http") ? imagePath : getStorageUrl("dish-images", imagePath)}
              alt={dish.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              loading="lazy"
            />
          ) : (
            <UtensilsCrossed size={32} className="text-text-muted/40" />
          )}
        </div>
        <CardContent>
          <h3 className="font-semibold text-text text-sm line-clamp-1">{dish.name}</h3>
          {dish.short_description && (
            <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{dish.short_description}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
