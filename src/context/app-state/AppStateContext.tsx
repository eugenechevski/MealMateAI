import { AppState, GuestUser, Ingredient, Recipe } from "@/core";
import { createContext, useContext, useReducer, Dispatch } from "react";

interface State {
  appState: AppState;
}

type Action =
  | { type: "SET_APP_STATE"; payload: AppState }
  | { type: "START_NEW_MEAL_PLAN" }
  | { type: "APPEND_NEW_DAY" }
  | { type: "REMOVE_DAY"; payload: string }
  | { type: "SWAP_DAYS"; payload: { day1: string; day2: string } }
  | { type: "APPEND_NEW_MEAL"; payload: string }
  | { type: "REMOVE_MEAL"; payload: string }
  | { type: "SWAP_MEALS"; payload: { meal1: string; meal2: string } }
  | {
      type: "UPDATE_RECIPE";
      payload: { day: string; meal: string; recipe: Recipe };
    }
  | { type: "SIGN_OUT" }
  | { type: "SAVE_MEAL_PLAN" }
  | { type: "ADD_USER_INGREDIENT"; payload: Ingredient }
  | { type: "REMOVE_USER_INGREDIENT"; payload: string }
  | { type: "UPDATE_USER_INGREDIENT"; payload: [Ingredient, Ingredient] };

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
    case "START_NEW_MEAL_PLAN":
      state?.appState?.startNewMealPlan();
      return { ...state };
    case "APPEND_NEW_DAY":
      state?.appState?.currentMealPlan?.appendNewDay();
      return { ...state };
    case "REMOVE_DAY":
      state?.appState?.currentMealPlan?.removeDay(action.payload);
      return { ...state };
    case "SWAP_DAYS":
      state?.appState?.currentMealPlan?.swapDays(
        action.payload.day1,
        action.payload.day2
      );
      return { ...state };
    case "APPEND_NEW_MEAL":
      state?.appState?.currentMealPlan?.days[action.payload]?.appendNewMeal();
      return { ...state };
    case "REMOVE_MEAL":
      state?.appState?.currentMealPlan?.days[action.payload]?.removeMeal(
        action.payload
      );
      return { ...state };
    case "SWAP_MEALS":
      state?.appState?.currentMealPlan?.days[action.payload.meal1]?.swapMeals(
        action.payload.meal1,
        action.payload.meal2
      );
      return { ...state };
    case "UPDATE_RECIPE":
      const { day, meal, recipe } = action.payload;

      if (
        day in state?.appState?.currentMealPlan?.days &&
        meal in state?.appState?.currentMealPlan?.days[day].meals
      ) {
        state?.appState?.currentMealPlan?.selectRecipeForMeal(
          recipe,
          day,
          meal
        );
      }

      return { ...state };
    case "SIGN_OUT":
      state.appState = new AppState(
        new GuestUser(),
        state?.appState?.selectionMenu
      );
      return { ...state };
    case "SAVE_MEAL_PLAN":
      state?.appState?.user.saveMealPlan(
        state?.appState?.currentMealPlan?.getMealPlanData()
      );
      return { ...state };
    default:
      return state;
    case "ADD_USER_INGREDIENT":
      state?.appState?.currentMealPlan?.addUserIngredient(action.payload);
      return { ...state };
    case "REMOVE_USER_INGREDIENT":
      state?.appState?.currentMealPlan?.removeUserIngredient(action.payload);
      return { ...state };
    case "UPDATE_USER_INGREDIENT":
      state?.appState?.currentMealPlan?.updateUserIngredient(
        action.payload[0],
        action.payload[1]
      );
      return { ...state };
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
