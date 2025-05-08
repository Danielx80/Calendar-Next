import type { Modifier } from "@dnd-kit/core";

export function createSnapModifier(
  slotWidthPx: number,
  snapMinutes: number
): Modifier {
  const pxPerMin = slotWidthPx / 60;
  const snapPx = pxPerMin * snapMinutes;
  return ({ transform }) => ({
    ...transform,
    x: Math.round(transform.x / snapPx) * snapPx,
  });
}
