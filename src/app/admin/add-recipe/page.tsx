/**
 * A page form for adding new recipes
 */
"use client";

import { webUrlPattern } from "@/lib/constants";

import { motion } from "framer-motion";

import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { createClient } from "@/lib/supabase/client";

type FormData = {
  name: string;
  cuisine: string;
  ingredients: string;
  steps: string;
  imageUrl: string;
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

  const onSubmit = useCallback(async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Add the recipe to the database
      // TODO
      
      alert('Recipe added successfully!');
      reset();
    } catch (error) {
      console.error('Error adding recipe:', error);
      alert('Failed to add recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [reset]);

  

  return (
    <motion.form className="primary-form" onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("name", { required: true })}
        placeholder="Recipe Name"
        className="primary-input"
      />
      {errors.name && <span>This field is required</span>}

      <input
        {...register("cuisine", { required: true })}
        placeholder="Cuisine"
        className="primary-input"
      />
      {errors.cuisine && <span>This field is required</span>}

      <textarea
        {...register("ingredients", { required: true })}
        placeholder="Ingredients (one per line)"
        className="primary-input"
      />
      {errors.ingredients && <span>This field is required</span>}

      <textarea
        {...register("steps", { required: true })}
        placeholder="Steps (one per line)"
        className="primary-input"
      />
      {errors.steps && <span>This field is required</span>}

      <input
        {...register("imageUrl", { required: true, pattern: webUrlPattern})}
        placeholder="Image URL"
        className="primary-input"
      />
      {errors.imageUrl && <span>This field is required</span>}

      <button type="submit" disabled={isSubmitting} className="primary-button">
        {isSubmitting ? "Adding..." : "Add Recipe"}
      </button>
    </motion.form>
  );
}
