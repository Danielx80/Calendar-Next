import { TaskDefinition } from "@/components/calendar/types";
import { useState, useEffect, FormEvent } from "react";


interface UseTaskFormProps {
  task: TaskDefinition;
  onAction?: (
    id: string,
    action: "update" | "Iniciar" | "Pausa" | "Finalizar",
    payload?: Record<string, unknown>
  ) => void;
}

export function useTaskForm({ task, onAction }: UseTaskFormProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [formDesc, setFormDesc] = useState(task.description);
  const [formAssigned, setFormAssigned] = useState(task.asigned_to);
  const [formStart, setFormStart] = useState("");
  const [formEnd, setFormEnd] = useState("");
  const [formComments, setFormComments] = useState("");
  const [formSubtasks, setFormSubtasks] = useState<string[]>(
    Array.isArray(task.custom_fields.subtasks)
      ? task.custom_fields.subtasks
      : []
  );

  useEffect(() => {
    if (detailOpen) {
      setFormDesc(task.description);
      setFormAssigned(task.asigned_to);
      setFormStart(new Date(task.start_at).toISOString().slice(0, 16));
      setFormEnd(new Date(task.end_at).toISOString().slice(0, 16));
      setFormComments("");
      setFormSubtasks(
        Array.isArray(task.custom_fields.subtasks)
          ? task.custom_fields.subtasks
          : []
      );
    }
  }, [detailOpen, task]);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    onAction?.(task.id, "update", {
      description: formDesc,
      asigned_to: formAssigned,
      start_at: new Date(formStart),
      end_at: new Date(formEnd),
      custom_fields: { subtasks: formSubtasks },
      comments: formComments,
    });
    setDetailOpen(false);
  };

  return {
    detailOpen,
    setDetailOpen,
    formDesc,
    setFormDesc,
    formAssigned,
    setFormAssigned,
    formStart,
    setFormStart,
    formEnd,
    setFormEnd,
    formComments,
    setFormComments,
    formSubtasks,
    setFormSubtasks,
    handleSave,
  };
}
