import {
  AppState,
  MainUser,
  SelectionMenu,
} from "@/core";
import buildSelectionMenu from "@/lib/buildSelectionMenu";

describe("AppState", () => {
  it("should run the app", async () => {
    const rawData = (await import("../../../initialSelectionMenu.json"))
      .recipes as LocalRawMenuData;
    const app = new AppState(
      new MainUser("0", "John Doe", "johndow@mail.com"),
      buildSelectionMenu(rawData, "local") as SelectionMenu
    );

    expect((app.user as MainUser).username).toBe("John Doe");
    expect(Object.keys(app.selectionMenu.items).length).toBeGreaterThan(0);
  });
});
