import { formatTime, parseTimeToDate } from "@/components/calendar/helpers/dayUtils";
import { TaskDefinition, Timing } from "@/components/calendar/types";
import { useState, useEffect } from "react";


interface UseTaskMenuProps {
  task: TaskDefinition;
  onResize?: (id: string, timing: Timing) => void;
  onAction?: (
    id: string,
    action: "update" | "Iniciar" | "Pausa" | "Finalizar",
    payload?: Record<string, unknown>
  ) => void;
  onDelete?: (id: string) => void;
}

export function useTaskMenu({ task, onResize, onAction, onDelete }: UseTaskMenuProps) {
  const [editingSubmenu, setEditingSubmenu] = useState(false);
  const [startTime, setStartTime] = useState(formatTime(task.start_at));
  const [endTime, setEndTime] = useState(formatTime(task.end_at));

  useEffect(() => {
    if (editingSubmenu) {
      setStartTime(formatTime(task.start_at));
      setEndTime(formatTime(task.end_at));
    }
  }, [editingSubmenu, task]);

  const handleResizeSave = () => {
    const newStart = parseTimeToDate(task.start_at, startTime);
    const newEnd = parseTimeToDate(task.end_at, endTime);
    onResize?.(task.id, {
      startHour: newStart.getHours(),
      startMinute: newStart.getMinutes(),
      endHour: newEnd.getHours(),
      endMinute: newEnd.getMinutes(),
    });
    setEditingSubmenu(false);
  };

  return {
    // estado
    editingSubmenu,
    startTime,
    endTime,
    // setters
    setStartTime,
    setEndTime,
    setEditingSubmenu,
    // handlers
    handleResizeSave,
    handleStartAction: () => onAction?.(task.id, "Iniciar"),
    handlePauseAction: () => onAction?.(task.id, "Pausa"),
    handleFinishAction: () => onAction?.(task.id, "Finalizar"),
    handleDelete: () => onDelete?.(task.id),
  };
}
