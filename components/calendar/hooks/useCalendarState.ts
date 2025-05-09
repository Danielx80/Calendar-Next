import { useCallback, useState } from "react";
import { ViewMode } from "../components/timelineNav/TimelineNav";
import { managerConfig } from "../data";

export function useCalendarState(configDays: number) {
  const [baseDate, setBaseDate] = useState(new Date());
  const [displayedDate, setDisplayedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [daysToShow, setDaysToShow] = useState(configDays);

  const goPrev = useCallback(() => {
    const x = new Date(baseDate);
    x.setDate(x.getDate() - 1);
    setBaseDate(x);
    setDisplayedDate(x);
  }, [baseDate]);

  const goNext = useCallback(() => {
    const x = new Date(baseDate);
    x.setDate(x.getDate() + 1);
    setBaseDate(x);
    setDisplayedDate(x);
  }, [baseDate]);

  const goToday = useCallback(() => {
    const today = new Date();
    setBaseDate(today);
    setDisplayedDate(today);
    setViewMode("day");
    setDaysToShow(managerConfig.days_to_show);
  }, []);

  const changeView = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    if (mode === "day") {
      setDaysToShow(managerConfig.days_to_show);
      const today = new Date();
      setBaseDate(today);
      setDisplayedDate(today);
    } else if (mode === "week") {
      setDaysToShow(7);
      const today = new Date();
      setBaseDate(today);
      setDisplayedDate(today);
    }
  }, []);

  const onDateSelect = useCallback(
    (d: Date) => {
      setViewMode("day");
      setDaysToShow(configDays);
      setBaseDate(d);
      setDisplayedDate(d);
    },
    [configDays]
  );

  return {
    baseDate,
    displayedDate,
    viewMode,
    daysToShow,
    goPrev,
    goNext,
    goToday,
    changeView,
    onDateSelect,
    setDisplayedDate,
    setDaysToShow,
  };
}
