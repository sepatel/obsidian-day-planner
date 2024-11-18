import { TFile } from "obsidian";
import { derived, get, type Readable } from "svelte/store";

import { DataviewFacade } from "../../service/dataview-facade";
import * as q from "../../util/dataview-query";

interface UseTasksFromExtraSourcesProps {
  dataviewSource: Readable<string>;
  refreshSignal: Readable<unknown>;
  visibleDailyNotes: Readable<TFile[]>;
  dataviewFacade: DataviewFacade;
}

export function useTasksFromExtraSources({
  dataviewSource,
  refreshSignal,
  visibleDailyNotes,
  dataviewFacade,
}: UseTasksFromExtraSourcesProps) {
  return derived([dataviewSource, refreshSignal], ([$dataviewSource]) => {
    const noAdditionalSource = $dataviewSource.trim().length === 0;

    if (noAdditionalSource) {
      return [];
    }

    // todo: this will ignore clocks from daily notes
    const queryFromExtraSources = q.andNot(
      $dataviewSource,
      q.anyOf(get(visibleDailyNotes)),
    );

    return dataviewFacade.getAllTasksFrom(queryFromExtraSources);
  });
}
