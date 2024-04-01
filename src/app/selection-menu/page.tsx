"use client";

import { useSearchParams } from "next/navigation";
import { useAppState } from "@/context/app-state/AppStateContext";
import { useEffect } from "react";
import { Suspense } from "react";

export default function SelectionMenuPage() {
  const { state, dispatch } = useAppState();
  const searchParams = useSearchParams();
  const day = searchParams.get("day");
  const meal = searchParams.get("meal");

  useEffect(() => {
    if (!state.appState) return;
  }, [state]);

  return (
    <Suspense>
      <main className="flex flex-col justify-center items-center gap-12 w-screen h-screen">
        <h1 className="text-5xl font-secondary mb-12">Selection Menu</h1>
      </main>
    </Suspense>
  );
}
