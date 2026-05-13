import Image from "next/image";
import { UtensilsCrossed } from "lucide-react";
import { getStorageUrl } from "@/lib/utils";

interface Props {
  imagePath: string | null;
  name: string;
}

export function DishHero({ imagePath, name }: Props) {
  return (
    <div className="relative aspect-video bg-beige-dark overflow-hidden">
      {imagePath ? (
        <Image
          src={imagePath.startsWith("http") ? imagePath : getStorageUrl("dish-images", imagePath)}
          alt={name}
          fill
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <UtensilsCrossed size={64} className="text-text-muted/30" />
        </div>
      )}
    </div>
  );
}
