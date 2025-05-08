import { useMemo } from "react";
import type { TaskDefinition } from "../../../types";

export function useTaskDuration(task: TaskDefinition) {
  return useMemo(() => {
    const start = task.start_at.getHours() * 60 + task.start_at.getMinutes();
    const end = task.end_at.getHours() * 60 + task.end_at.getMinutes();
    const diff = end - start;
    const h = Math.floor(diff / 60);
    const m = diff % 60;

    if (h > 0) {
      return m === 0
        ? `${h} hora${h > 1 ? "s" : ""}`
        : `${h}:${String(m).padStart(2, "0")}`;
    }
    return `${m} min`;
  }, [task.start_at, task.end_at]);
}
