"use client";
import { useState, useCallback, useRef } from "react";
import type {
  DragStartEvent,
  DragMoveEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { TaskDefinition, TaskManager, User } from "../../../types";
import { getDayNumber } from "../../../helpers/dayUtils";

interface Orig {
  start: number;
  end: number;
  user: string;
  section: string;
}

interface Args {
  tasks: TaskDefinition[];
  setTasks: React.Dispatch<React.SetStateAction<TaskDefinition[]>>;
  slotWidthPx: number;
  snapMinutes: number;
  managerConfig: TaskManager;
}

export function useTaskDragHandlers({
  tasks,
  setTasks,
  slotWidthPx,
  snapMinutes,
  managerConfig,
}: Args) {
  const [activeTask, setActiveTask] = useState<TaskDefinition | null>(null);
  const origRef = useRef<Orig | null>(null);

  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      const t = tasks.find((x) => x.id === active.id.toString()) ?? null;
      setActiveTask(t);
      if (t) {
        const startMin = t.start_at.getHours() * 60 + t.start_at.getMinutes();
        const endMin = t.end_at.getHours() * 60 + t.end_at.getMinutes();
        origRef.current = {
          start: startMin,
          end: endMin,
          user: t.asigned_to,
          section: t.type,
        };
      }
    },
    [tasks]
  );

  const handleDragMove = useCallback(({ delta }: DragMoveEvent) => {
    console.log(delta);
  }, []);

  const handleDragEnd = useCallback(
    ({ active, over, delta }: DragEndEvent) => {
      if (!activeTask || !origRef.current) {
        setActiveTask(null);
        return;
      }

      // usamos const en lugar de let
      const {
        start: origStart,
        end: origEnd,
        user: origUser,
        section: origSection,
      } = origRef.current;
      const duration = origEnd - origStart;

      // determinar fecha destino
      let targetDate = new Date(activeTask.start_at);
      const overId = over?.id?.toString() ?? "";
      if (overId.startsWith("time-")) {
        const [datePart] = overId.split("_");
        const [y, m, d] = datePart.replace("time-", "").split("-").map(Number);
        targetDate = new Date(y, m - 1, d);
      }
      const dayIndex = targetDate.getDay();

      // usuario y sección propuestas
      let targetUser = origUser;
      let targetSection = origSection;
      if (overId.startsWith("time-")) {
        const [, pid] = overId.split("-user-");
        if (pid) targetUser = pid;
        const sec = managerConfig.sections.find((s) =>
          (s.users as User[]).some((u) => u.UUID === targetUser)
        );
        if (sec) targetSection = sec.id;
      }

      // límites globales
      const [sH, sM] = managerConfig.start_time.split(":").map(Number);
      const [eH, eM] = managerConfig.end_time.split(":").map(Number);
      const startBound = sH * 60 + sM;
      const endBound = eH * 60 + eM;

      // calcular nuevo inicio
      const movedSlots = Math.round(
        delta.x / ((slotWidthPx / 60) * snapMinutes)
      );
      let newStart = origStart + movedSlots * snapMinutes;
      newStart = Math.max(startBound, Math.min(newStart, endBound - duration));

      // rangos no-drop
      const user = managerConfig.sections
        .flatMap((sec) => sec.users as User[])
        .find((u) => u.UUID === targetUser);

      const disabled: { start: number; end: number }[] = [];
      if (user) {
        const wd = user.work_days.find((w) => getDayNumber(w.day) === dayIndex);
        if (wd) {
          const [sh, sm] = wd.start_time.split(":").map(Number);
          const [lh, lm] = (wd.lunch_time ?? "0:0").split(":").map(Number);
          const lunchDur = wd.lunch_duration ?? 0;
          const [eh, em] = wd.end_time.split(":").map(Number);

          disabled.push(
            { start: startBound, end: sh * 60 + sm },
            { start: lh * 60 + lm, end: lh * 60 + lm + lunchDur },
            { start: eh * 60 + em, end: endBound }
          );
        }
      }

      // si colisiona, revertir
      const intersects = disabled.some(
        (r) => newStart < r.end && newStart + duration > r.start
      );
      if (intersects) {
        newStart = origStart;
        targetUser = origUser;
        targetSection = origSection;
      }

      // aplicar cambios
      const newEnd = newStart + duration;
      setTasks((list) =>
        list.map((t) => {
          if (t.id !== active.id.toString()) return t;
          const s = new Date(t.start_at);
          s.setHours(Math.floor(newStart / 60), newStart % 60);
          const e = new Date(t.end_at);
          e.setHours(Math.floor(newEnd / 60), newEnd % 60);
          return {
            ...t,
            start_at: s,
            end_at: e,
            asigned_to: targetUser,
            type: targetSection,
          };
        })
      );

      setActiveTask(null);
      origRef.current = null;
    },
    [activeTask, slotWidthPx, snapMinutes, managerConfig, setTasks]
  );

  // eliminamos el parámetro no usado
  const handleDragCancel = useCallback(() => {
    setActiveTask(null);
    origRef.current = null;
  }, []);

  return {
    activeTask,
    dragHandlers: {
      onDragStart: handleDragStart,
      onDragMove: handleDragMove,
      onDragEnd: handleDragEnd,
      onDragCancel: handleDragCancel,
    },
  };
}
