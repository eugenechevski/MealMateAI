'use client';

import { useAppState } from "@/context/app-state/AppStateContext";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function StartPage() {
    const { state, dispatch } = useAppState();

    const supabase = createClient();
    
    useEffect(() => {
        if (state.appState) {
            // redirect to home page
        }

    }, [supabase]);
}
