import { Recipe } from "@/core";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function RecipeCard({ recipe }: { recipe: Recipe | null }) {
  // Fetch the image from the URL
  const [image, setImage] = useState('');

  useEffect(() => {
    if (!recipe?.image?.url) return;

    fetch(`/api/image-proxy?url=${recipe.image.url}`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setImage(url);
      });
  }, [recipe?.image?.url]);

  return (
    <div className="primary-recipe-card">
      <h2 className="text-2xl font-secondary">{recipe?.name}</h2>
      <Image
        src={image as string}
        alt={recipe?.image?.title as string}
        fill
      />
    </div>
  );
}
