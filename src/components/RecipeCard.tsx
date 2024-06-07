import { Recipe } from "@/core";
import Image from "next/image";
import { memo } from "react";

const RecipeCard = ({ recipe }: { recipe: Recipe | null }) => {
  return (
    <div className="bg-primary-gray flex flex-col justify-center items-center rounded-2xl shadow-2xl p-3 gap-7">
      <h2 className="text-sm laptop:text-xl font-secondary text-center h-8 w-full overflow-hidden overflow-ellipsis whitespace-nowrap">{recipe?.name}</h2>
      <div className="relative aspect-square h-24 tablet:h-48">
        <Image
          src={recipe?.image?.url as string}
          alt={recipe?.image?.title as string}
          sizes="6rem"
          loading="lazy"
          fill
        />
      </div>
    </div>
  );
}

export default memo(RecipeCard);