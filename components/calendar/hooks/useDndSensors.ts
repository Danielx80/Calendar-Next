import { useMemo } from "react";
import { useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { createSnapModifier } from "../helpers/snapToGrid";


// Provee sensores y modificador de snap para DnD.
export function useDndSensors(slotWidthPx: number, snapMinutes: number) {
  const sensors = useSensors(useSensor(PointerSensor));
  const snapModifier = useMemo(
    () => createSnapModifier(slotWidthPx, snapMinutes),
    [slotWidthPx, snapMinutes]
  );
  return { sensors, snapModifier };
}
