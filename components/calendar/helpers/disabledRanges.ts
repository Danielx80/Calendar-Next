import { TdDisabled } from "../types";

type MinuteRangeInput =
  | TdDisabled
  | { start: number; end: number }
  | {
      startHour?: number;
      startMinute?: number;
      endHour?: number;
      endMinute?: number;
    };

export function toMinuteRange(r: MinuteRangeInput): {
  start: number;
  end: number;
} {
  // Si viene con fechas
  if (
    "startDate" in r &&
    r.startDate instanceof Date &&
    r.endDate instanceof Date
  ) {
    const start = r.startDate.getHours() * 60 + r.startDate.getMinutes();
    const end = r.endDate.getHours() * 60 + r.endDate.getMinutes();
    return { start, end };
  }

  // Si viene con start/end numéricos
  if (
    "start" in r &&
    typeof r.start === "number" &&
    typeof r.end === "number"
  ) {
    return { start: r.start, end: r.end };
  }

  // Si viene con horas/minutos desglosados
  if (
    "startHour" in r ||
    "startMinute" in r ||
    "endHour" in r ||
    "endMinute" in r
  ) {
    const startHour = r.startHour ?? 0;
    const startMinute = r.startMinute ?? 0;
    const endHour = r.endHour ?? 0;
    const endMinute = r.endMinute ?? 0;
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;
    return { start, end };
  }

  throw new Error(
    "Invalid input: Missing required properties for conversion to minute range."
  );
}
