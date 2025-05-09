import { useCallback } from "react";
import { TaskDefinition, Timing } from "../types";

export function useTaskActions(
  setTasks: React.Dispatch<React.SetStateAction<TaskDefinition[]>>
) {
  const handleResize = useCallback((id: string, timing: Timing) => {
    setTasks((ts) =>
      ts.map((t) =>
        t.id !== id
          ? t
          : {
              ...t,
              start_at: new Date(
                t.start_at.getFullYear(),
                t.start_at.getMonth(),
                t.start_at.getDate(),
                timing.startHour,
                timing.startMinute
              ),
              end_at: new Date(
                t.end_at.getFullYear(),
                t.end_at.getMonth(),
                t.end_at.getDate(),
                timing.endHour,
                timing.endMinute
              ),
            }
      )
    );
  }, [setTasks]);

  const handleAction = useCallback(
    (
      id: string,
      action: "update" | "Iniciar" | "Pausa" | "Finalizar",
      payload?: Partial<TaskDefinition>
    ) => {
      setTasks((ts) =>
        ts.map((t) => {
          if (t.id !== id) return t;
          switch (action) {
            case "update":
              return { ...t, ...payload };
            case "Iniciar":
              return { ...t, status: "in_progress" };
            case "Pausa":
              return { ...t, status: "paused" };
            case "Finalizar":
              return { ...t, status: "finished" };
          }
        })
      );
    },
    [setTasks]
  );

  return { handleResize, handleAction };
}