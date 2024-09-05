import { ItemView, WorkspaceLeaf } from "obsidian";

import { dateRangeContextKey, viewTypeWeekly } from "../constants";
import type { DayPlannerSettings } from "../settings";
import type { ComponentContext, DateRange } from "../types";
import { getDaysOfCurrentWeek } from "../util/moment";

import HeaderActions from "./components/week/header-actions.svelte";
import Week from "./components/week/week.svelte";
import { useDateRanges } from "./hooks/use-date-ranges";

export default class WeeklyView extends ItemView {
  private weekComponent?: Week;
  private headerActionsComponent?: HeaderActions;
  private dateRange?: DateRange;

  constructor(
    leaf: WorkspaceLeaf,
    private readonly settings: () => DayPlannerSettings,
    private readonly componentContext: ComponentContext,
    private readonly dateRanges: ReturnType<typeof useDateRanges>,
  ) {
    super(leaf);
  }

  getViewType(): string {
    return viewTypeWeekly;
  }

  getDisplayText(): string {
    return "Week Planner";
  }

  getIcon() {
    return this.settings().timelineIcon;
  }

  async onOpen() {
    const headerEl = this.containerEl.children[0];
    const contentEl = this.containerEl.children[1];

    this.dateRange = this.dateRanges.trackRange(getDaysOfCurrentWeek());

    const context = new Map([
      ...this.componentContext,
      [dateRangeContextKey, this.dateRange],
    ]);

    this.weekComponent = new Week({
      target: contentEl,
      context,
    });

    const viewActionsEl = headerEl.querySelector(".view-actions");

    if (viewActionsEl) {
      const customActionsEl = createDiv();

      viewActionsEl.prepend(customActionsEl);
      this.headerActionsComponent = new HeaderActions({
        target: customActionsEl,
        context,
      });
    }
  }

  async onClose() {
    this.dateRange?.untrack();
    this.weekComponent?.$destroy();
    this.headerActionsComponent?.$destroy();
  }
}
