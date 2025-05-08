// src/hooks/useRows.ts
import { useMemo } from "react";
import { TaskDefinition, TaskManager, Row, User, TdDisabled } from "../types";
import { getDayNumber, formatDateKey } from "../helpers/dayUtils";

const createRange = (
  date: Date,
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
  type: string,
  label: string
): TdDisabled => {
  const start = new Date(date);
  start.setHours(startHour, startMinute, 0, 0);
  const end = new Date(date);
  end.setHours(endHour, endMinute, 0, 0);
  return {
    id: `${formatDateKey(date)}-${type}`,
    user_id: "",
    type,
    description: label,
    startDate: start,
    endDate: end,
    comment: "",
  };
};

export function useRows(
  tasks: TaskDefinition[],
  config: TaskManager,
  startDate: Date,
  daysToShow: number
): Row[] {
  // 1) Precalcular los dateKeys del rango visible
  const dateKeys = useMemo(() => {
    const keys: string[] = [];
    const base = new Date(startDate);
    base.setHours(0, 0, 0, 0);
    for (let i = 0; i < daysToShow; i++) {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      keys.push(formatDateKey(d));
    }
    return keys;
  }, [startDate, daysToShow]);

  return useMemo(() => {
    return config.sections.flatMap((section) =>
      (section.users as User[]).map((user) => {
        // 2) Calcular rangos deshabilitados por usuario y día
        const disabledRanges: TdDisabled[] = [];
        const base = new Date(startDate);
        base.setHours(0, 0, 0, 0);
        for (let i = 0; i < daysToShow; i++) {
          const d = new Date(base);
          d.setDate(d.getDate() + i);
          user.work_days.forEach((wd) => {
            if (getDayNumber(wd.day) !== d.getDay()) return;
            const [sh, sm] = wd.start_time.split(":").map(Number);
            const [lh, lm] = (wd.lunch_time ?? "0:0").split(":").map(Number);
            const lunchDur = wd.lunch_duration ?? 0;
            const [eh, em] = wd.end_time.split(":").map(Number);

            disabledRanges.push(
              createRange(d, 0, 0, sh, sm, "arrival", "Fuera laboral"),
              createRange(d, lh, lm, lh, lm + lunchDur, "lunch", "Almuerzo"),
              createRange(d, eh, em, 23, 59, "departure", "Fuera laboral")
            );
          });
        }

        // 3) Filtrar y ordenar tareas del usuario dentro del rango
        const rowTasks = tasks
          .filter(
            (t) =>
              t.asigned_to === user.UUID &&
              dateKeys.includes(formatDateKey(t.start_at))
          )
          .sort(
            (a, b) => a.start_at.getTime() - b.start_at.getTime()
          );

        // 4) Construir la fila
        const row: Row = {
          sectionId: section.id,
          sectionName: section.name,
          sectionDescription: section.description ?? "",
          sectionStatus: section.status ?? "active",
          sectionOrder: section.order,
          sectionColor: section.color,
          sectionIcon: section.icon,
          userId: user.UUID,
          userName: user.name,
          userRole: user.role,
          avatarUrl: user.image,
          disabledRanges,
          tasks: rowTasks,
        };

        return row;
      })
    );
  }, [tasks, config.sections, startDate, daysToShow, dateKeys]);
}
