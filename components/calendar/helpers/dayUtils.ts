// src/helpers/dayUtils.ts

/**
 * Devuelve el número de día (0 Domingo ... 6 Sábado)
 */
export function getDayNumber(dayName: string): number {
  const days: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  return days[dayName.toLowerCase()] ?? 0;
}

/**
 * Devuelve la clave en formato "YYYY-MM-DD" para una fecha en zona local
 */
export function formatDateKey(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
}

/**
 * Parsea un valor de <input type="date"> a Date en medianoche local
 */
export function parseLocalDateInput(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Formatea un Date a "HH:MM"
 */
export function formatTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Parsea "HH:MM" sobre el mismo día de base
 */
export function parseTimeToDate(base: Date, hhmm: string): Date {
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(
    base.getFullYear(), base.getMonth(), base.getDate(), h, m
  );
}

/**
 * Formatea un Date a "YYYY-MM-DDTHH:MM" para <input type="datetime-local">
 */
export function formatDateTimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}