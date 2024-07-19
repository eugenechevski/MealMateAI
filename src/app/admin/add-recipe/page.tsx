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