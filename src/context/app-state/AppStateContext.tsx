import { AppState } from "@/core";
import { createContext, useContext, useReducer, Dispatch } from "react";

interface State {
  appState: AppState;
}

type Action = { type: "SET_APP_STATE"; payload: AppState };

interface AppStateContextProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const AppStateContext = createContext<AppStateContextProps | undefined>(
  undefined
);

const initialState: State = {
  appState: {} as AppState,
};

const appStateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_APP_STATE":
      return { ...state, appState: action.payload };
    default:
      return state;
  }
};

export const AppStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);
  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): AppStateContextProps => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within a AppStateProvider");
  }
  return context;
};
