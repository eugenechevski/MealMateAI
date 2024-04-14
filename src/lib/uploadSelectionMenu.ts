const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

async function uploadRecipes() {
  // Get the variables
  dotenv.config({ path: ".env.local" });

  const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const PUBLIC_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  if (!PUBLIC_URL || !PUBLIC_ANON_KEY) {
    console.log(PUBLIC_URL, PUBLIC_ANON_KEY);
    console.error("Missing environment variables.");
    return;
  }

  // Connect to Supabase
  const supabase = createClient(PUBLIC_URL, PUBLIC_ANON_KEY);
  if (!supabase) {
    console.error("Could not connect to Supabase.");
    return;
  }

  // Load the raw data
  const data = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, "../../initialSelectionMenu.json"),
    "utf8"
  ));

  if (!data) {
    console.error("Could not load the data.");
    return;
  }

  // Insert the recipes
  for (const recipe of data.recipes) {
    const { name, cuisine, ingredients, steps, image, nutrition } = recipe;
    console.log(name, cuisine);

    // Insert recipe
    const { data, error: recipeError } = await supabase
      .from("recipes")
      .insert([{ name, cuisine }]);
    const { data: recipe_data } = await supabase
      .from("recipes")
      .select("id")
      .eq("name", name);
    const recipe_id = recipe_data && (recipe_data[0]?.id as string);
    if (!recipe_id) {
      console.error("Error inserting recipe:", recipeError);
      continue; // Skip to next recipe if there's an error
    }

    if (recipeError) {
      console.error("Error inserting recipe:", recipeError);
      continue; // Skip to next recipe if there's an error
    }

    // Insert ingredients
    for (const ingredient of ingredients) {
      await supabase.from("ingredients").insert({
        recipe_id: recipe_id as string,
        ...ingredient,
        amount: Number(ingredient.amount),
      });
    }

    // Insert steps
    const stepsInsert = steps.map((step: any, index: number) => ({
      recipe_id,
      description: step,
      step_order: index + 1,
    }));
    await supabase.from("steps").insert(stepsInsert);

    // Insert image
    if (image) {
      const { source, source_url, title, url, width, height } = image;
      await supabase.from("images").insert({
        recipe_id,
        source,
        source_url,
        title,
        url,
        width,
        height,
      });
    }

    // Insert nutrition
    if (nutrition) {
      const { caloriesPerServing, protein, carbohydrates, fat } = nutrition;
      await supabase.from("nutrition").insert([
        {
          recipe_id,
          calories_per_serving: Number(caloriesPerServing),
          protein: Number(protein),
          carbohydrates: Number(carbohydrates),
          fat: Number(fat),
        },
      ]);
    }
  }

  console.log("All recipes uploaded successfully.");
}

uploadRecipes();
