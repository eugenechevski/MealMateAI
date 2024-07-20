"use client";

import { webUrlPattern } from "@/lib/constants";
import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";

type FormData = {
  name: string;
  cuisine: string;
  ingredients: string;
  steps: string;
  imageUrl: string;
  imageTitle: string;
  imageWidth: number;
  imageHeight: number;
  imageSource: string;
  imageSourceUrl: string;
  servings: number;
  caloriesPerServing: number;
  protein: number;
  carbohydrates: number;
  fat: number;
};

export default function AddNewRecipePage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const supabase = createClient();

  const onSubmit = useCallback(
    async (data: FormData) => {
      setIsSubmitting(true);
      try {
        // Add the recipe to the database
        const { data: recipeData, error: recipeError } = await supabase
          .from('recipes')
          .insert({ name: data.name, cuisine: data.cuisine })
          .select()
          .single();

        if (recipeError) throw recipeError;

        // Add ingredients
        const ingredients = data.ingredients.split('\n').map(ingredient => {
          const [name, amount, unit] = ingredient.split(',').map(s => s.trim());
          return { recipe_id: recipeData.id, name, amount: parseFloat(amount), unit };
        });
        const { error: ingredientsError } = await supabase
          .from('ingredients')
          .insert(ingredients);

        if (ingredientsError) throw ingredientsError;

        // Add steps
        const steps = data.steps.split('\n').map((step, index) => ({
          recipe_id: recipeData.id,
          step_order: index + 1,
          description: step.trim()
        }));
        const { error: stepsError } = await supabase
          .from('steps')
          .insert(steps);

        if (stepsError) throw stepsError;

        // Add image
        const { error: imageError } = await supabase
          .from('images')
          .insert({
            recipe_id: recipeData.id,
            title: data.imageTitle,
            url: data.imageUrl,
            width: data.imageWidth,
            height: data.imageHeight,
            source: data.imageSource,
            source_url: data.imageSourceUrl
          });

        if (imageError) throw imageError;

        // Add nutrition
        const { error: nutritionError } = await supabase
          .from('nutrition')
          .insert({
            recipe_id: recipeData.id,
            servings: data.servings,
            calories_per_serving: data.caloriesPerServing,
            protein: data.protein,
            carbohydrates: data.carbohydrates,
            fat: data.fat
          });

        if (nutritionError) throw nutritionError;

        alert("Recipe added successfully!");
        reset();
      } catch (error) {
        console.error("Error adding recipe:", error);
        alert("Failed to add recipe. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [reset, supabase]
  ); 

  /**
   * The initial fetching of existing cuisine names for
   * the future mapping to the option menu.
   */
  useEffect(() => {
    async function fetchCuisines() {
      const { data, error } = await supabase
        .from('recipes')
        .select('cuisine');
      
      if (data && !error) {
        let uniqueCuisines: { [cuisine: string]: string } = {};
        for (const cuisine in data)
        {
          uniqueCuisines[cuisine] = "";
        }
        setCuisines(Object.keys(uniqueCuisines));
      }
    }

    fetchCuisines();
  }, [supabase]);

  return (
    <motion.form className="primary-form my-12" onSubmit={handleSubmit(onSubmit)}>
       {/** Recipe name */}
       <div className="primary-form-field">
        <label htmlFor="recipe-name">Recipe name</label>
        <input
          id="recipe-name"
          type="text"
          className="primary-input"
          {...register("name", { required: true })}
        />
        {errors.name && <span>This field is required</span>}
      </div>

      {/** Cuisine */}
      <div className="primary-form-field">
        <label htmlFor="cuisine">Cuisine</label>
        <input
          id="cuisine"
          type="text"
          className="primary-input"
          {...register("cuisine", { required: true })}
        />
        {errors.cuisine && <span>This field is required</span>}
      </div>

      {/** Ingredients */}
      <div className="primary-form-field">
        <label htmlFor="ingredients">Ingredients (one per line)</label>
        <textarea
          id="ingredients"
          className="primary-input"
          {...register("ingredients", { required: true })}
        />
        {errors.ingredients && <span>This field is required</span>}
      </div>

      {/** Steps */}
      <div className="primary-form-field">
        <label htmlFor="steps">Steps (one per line)</label>
        <textarea
          id="steps"
          className="primary-input"
          {...register("steps", { required: true })}
        />
        {errors.steps && <span>This field is required</span>}
      </div>

      {/** Image URL */}
      <div className="primary-form-field">
        <label htmlFor="imageUrl">Image URL</label>
        <input
          id="imageUrl"
          type="text"
          className="primary-input"
          {...register("imageUrl", { required: true, pattern: webUrlPattern })}
        />
        {errors.imageUrl && (
          <span>This field is required and must be a valid URL</span>
        )}
      </div>

      {/* Image Title */}
      <div className="primary-form-field">
        <label htmlFor="imageTitle">Image Title</label>
        <input
          id="imageTitle"
          type="text"
          className="primary-input"
          {...register("imageTitle", { required: true })}
        />
        {errors.imageTitle && <span>This field is required</span>}
      </div>

      {/** Image Width */}
      <div className="primary-form-field">
        <label htmlFor="imageWidth">Image Width</label>
        <input
          id="imageWidth"
          type="number"
          className="primary-input"
          {...register("imageWidth", { required: true, min: 1 })}
        />
        {errors.imageWidth && <span>This field is required and must be a positive number</span>}
      </div>

      {/** Image Height */}
      <div className="primary-form-field">
        <label htmlFor="imageHeight">Image Height</label>
        <input
          id="imageHeight"
          type="number"
          className="primary-input"
          {...register("imageHeight", { required: true, min: 1 })}
        />
        {errors.imageHeight && <span>This field is required and must be a positive number</span>}
      </div>

      {/** Image Source */}
      <div className="primary-form-field">
        <label htmlFor="imageSource">Image Source</label>
        <input
          id="imageSource"
          type="text"
          className="primary-input"
          {...register("imageSource", { required: true })}
        />
        {errors.imageSource && <span>This field is required</span>}
      </div>

      {/** Image Source URL */}
      <div className="primary-form-field">
        <label htmlFor="imageSourceUrl">Image Source URL</label>
        <input
          id="imageSourceUrl"
          type="text"
          className="primary-input"
          {...register("imageSourceUrl", { required: true, pattern: webUrlPattern })}
        />
        {errors.imageSourceUrl && <span>This field is required and must be a valid URL</span>}
      </div>

      {/** Servings */}
      <div className="primary-form-field">
        <label htmlFor="servings">Servings</label>
        <input
          id="servings"
          type="number"
          className="primary-input"
          {...register("servings", { required: true, min: 1 })}
        />
        {errors.servings && <span>This field is required and must be a positive number</span>}
      </div>
      
      {/** Calories per Serving */}
      <div className="primary-form-field">
        <label htmlFor="caloriesPerServing">Calories per Serving</label>
        <input
          id="caloriesPerServing"
          type="number"
          className="primary-input"
          {...register("caloriesPerServing", { required: true, min: 0 })}
        />
        {errors.caloriesPerServing && <span>This field is required and must be a non-negative number</span>}
      </div>

      {/** Protein */}
      <div className="primary-form-field">
        <label htmlFor="protein">Protein (g)</label>
        <input
          id="protein"
          type="number"
          className="primary-input"
          step="0.1"
          {...register("protein", { required: true, min: 0 })}
        />
        {errors.protein && <span>This field is required and must be a non-negative number</span>}
      </div>

      {/** Carbohydrates */}
      <div className="primary-form-field">
        <label htmlFor="carbohydrates">Carbohydrates (g)</label>
        <input
          id="carbohydrates"
          type="number"
          className="primary-input"
          step="0.1"
          {...register("carbohydrates", { required: true, min: 0 })}
        />
        {errors.carbohydrates && <span>This field is required and must be a non-negative number</span>}
      </div>

      {/** Fat */}
      <div className="primary-form-field">
        <label htmlFor="fat">Fat (g)</label>
        <input
          id="fat"
          type="number"
          className="primary-input"
          step="0.1"
          {...register("fat", { required: true, min: 0 })}
        />
        {errors.fat && <span>This field is required and must be a non-negative number</span>}
      </div>
      
      <button type="submit" disabled={isSubmitting} className="primary-button">
        {isSubmitting ? "Adding..." : "Add Recipe"}
      </button>
    </motion.form>
  );
}

function useEffect(arg0: () => void, arg1: import("@supabase/supabase-js").SupabaseClient<import("../../../../database.types").Database, "public", { Tables: { days: { Row: { day_id: string; day_number: number | null; plan_id: string; }; Insert: { day_id?: string; day_number?: number | null; plan_id: string; }; Update: { day_id?: string; day_number?: number | null; plan_id?: string; }; Relationships: [{ foreignKeyName: "days_plan_id_fkey"; columns: ["plan_id"]; isOneToOne: false; referencedRelation: "meal_plans"; referencedColumns: ["plan_id"]; }]; }; images: { Row: { height: number | null; id: string; recipe_id: string; source: string | null; source_url: string | null; title: string | null; url: string | null; width: number | null; }; Insert: { height?: number | null; id?: string; recipe_id: string; source?: string | null; source_url?: string | null; title?: string | null; url?: string | null; width?: number | null; }; Update: { height?: number | null; id?: string; recipe_id?: string; source?: string | null; source_url?: string | null; title?: string | null; url?: string | null; width?: number | null; }; Relationships: [{ foreignKeyName: "images_recipe_id_fkey"; columns: ["recipe_id"]; isOneToOne: false; referencedRelation: "recipes"; referencedColumns: ["id"]; }]; }; ingredients: { Row: { amount: number; id: string; name: string | null; recipe_id: string; unit: string | null; }; Insert: { amount: number; id?: string; name?: string | null; recipe_id: string; unit?: string | null; }; Update: { amount?: number; id?: string; name?: string | null; recipe_id?: string; unit?: string | null; }; Relationships: [{ foreignKeyName: "ingredients_recipe_id_fkey"; columns: ["recipe_id"]; isOneToOne: false; referencedRelation: "recipes"; referencedColumns: ["id"]; }]; }; meal_plans: { Row: { is_finished: boolean | null; plan_date: string | null; plan_id: string; user_id: string; }; Insert: { is_finished?: boolean | null; plan_date?: string | null; plan_id?: string; user_id: string; }; Update: { is_finished?: boolean | null; plan_date?: string | null; plan_id?: string; user_id?: string; }; Relationships: [{ foreignKeyName: "meal_plans_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "users"; referencedColumns: ["id"]; }]; }; meals: { Row: { day_id: string; meal_id: string; meal_number: number | null; recipe_id: string | null; }; Insert: { day_id: string; meal_id? /** Recipe name */: string; meal_number?: number | null; recipe_id?: string | null; }; Update: { day_id?: string; meal_id?: string; meal_number?: number | null; recipe_id?: string | null; }; Relationships: [{ foreignKeyName: "meals_day_id_fkey"; columns: ["day_id"]; isOneToOne: false; referencedRelation: "days"; referencedColumns: ["day_id"]; }, { foreignKeyName: "meals_recipe_id_fkey"; columns: ["recipe_id"]; isOneToOne: false; referencedRelation: "recipes"; referencedColumns: ["id"]; }]; }; nutrition: { Row: { calories_per_serving: number | null; carbohydrates: number | null; fat: number | null; id: string; protein: number | null; recipe_id: string; servings: number | null; }; Insert: { calories_per_serving?: number | null; carbohydrates?: number | null; fat?: number | null; id?: string; protein?: number | null; recipe_id: string; servings?: number | null; }; Update: { calories_per_serving?: number | null; carbohydrates?: number | null; fat?: number | null; id?: string; protein?: number | null; recipe_id?: string; servings?: number | null; }; Relationships: [{ foreignKeyName: "nutrition_recipe_id_fkey"; columns: ["recipe_id"]; isOneToOne: false; referencedRelation: "recipes"; referencedColumns: ["id"]; }]; }; recipes: { Row: { cuisine: string | null; id: string; name: string; }; Insert: { cuisine?: string | null; id?: string; name: string; }; Update: { cuisine?: string | null; id?: string; name?: string; }; Relationships: []; }; steps: { Row: { description: string | null; id: string; recipe_id: string; step_order: number | null; }; Insert: { description?: string | null; id?: string; recipe_id: string; step_order?: number | null; }; Update: { description?: string | null; id?: string; recipe_id?: string; step_order?: number | null; }; Relationships: [{ foreignKeyName: "steps_recipe_id_fkey"; columns: ["recipe_id"]; isOneToOne: false; referencedRelation: "recipes"; referencedColumns: ["id"]; }]; }; users: { Row: { email: string | null; id: string; is_admin: boolean | null; username: string | null; }; Insert: { email?: string | null; id: string; is_admin?: boolean | null; username?: string | null; }; Update: { email?: string | null; id?: string; is_admin?: boolean | null; username?: string | null; }; Relationships: []; }; }; Views: { [_ in never]: never; }; Functions: { [_ in never]: never; }; Enums: { [_ in never]: never; }; CompositeTypes: { [_ in never]: never; }; }>[]) {
  throw new Error("Function not implemented.");
}
