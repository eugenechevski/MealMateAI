import React, { ReactNode } from "react";
import { AppStateProvider } from "@/context/app-state/AppStateContext";

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  return <AppStateProvider>{children}</AppStateProvider>;
};
