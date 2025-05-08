import { useLayoutEffect, useState, useCallback } from "react";
import type { TaskDefinition } from "../../../types";

export function useTaskPosition(
  task: TaskDefinition,
  slotWidthPx: number,
  timeDivision: number
) {
  const pxPerMin = slotWidthPx / 60;
  const snapPx = pxPerMin * timeDivision;

  const compute = useCallback(() => {
    // En tu data el start_at / end_at son Date
    const start = task.start_at.getHours() * 60 + task.start_at.getMinutes();
    const end = task.end_at.getHours() * 60 + task.end_at.getMinutes();

    const leftPx = Math.round(((start % 60) * pxPerMin) / snapPx) * snapPx;
    const widthPx = Math.round((end - start) / timeDivision) * snapPx;
    return { leftPx, widthPx };
  }, [task.start_at, task.end_at, pxPerMin, snapPx, timeDivision]);

  const [dims, setDims] = useState(() => compute());

  // Recalcula dims siempre que cambie la tarea o configuración
  useLayoutEffect(() => {
    const newDims = compute();
    setDims((prev) => {
      if (prev.leftPx === newDims.leftPx && prev.widthPx === newDims.widthPx) {
        return prev;
      }
      return newDims;
    });
  }, [compute]);

  const pxToSlots = (px: number) => Math.round(px / snapPx);
  const slotsToMin = (s: number) => s * timeDivision;

  return {
    leftPx: dims.leftPx,
    widthPx: dims.widthPx,
    setDims,
    pxPerMin,
    snapPx,
    pxToSlots,
    slotsToMin,
  };
}
