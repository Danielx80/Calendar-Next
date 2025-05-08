"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import type { TaskDefinition, Timing, User } from "../../types";
import { useTaskDuration } from "./hooks/useTaskDuration";
import { managerConfig } from "../../data";
import { useTaskResize } from "./hooks/useTaskResize";
import { useTaskPosition } from "./hooks/useTaskPosition";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TaskList } from "./TaskList";
import {
  formatDateTimeLocal,
  formatTime,
  parseTimeToDate,
} from "../../helpers/dayUtils";

interface TaskBarProps {
  task: TaskDefinition;
  slotWidthPx: number;
  timeDivision: number;
  onResize?: (id: string, timing: Timing) => void;
  onDelete?: (id: string) => void;
  onAction?: (
    id: string,
    action: "update" | "Iniciar" | "Pausa" | "Finalizar",
    payload?: Record<string, unknown>
  ) => void;
  onClick?: () => void;
  isOverlay?: boolean;
  overlapCount?: number;
  overlapIndex?: number;
  rowHeightPx?: number;
}

export const TaskBar: React.FC<TaskBarProps> = ({
  task,
  slotWidthPx,
  timeDivision,
  onResize,
  onDelete,
  onAction,
  onClick,
  isOverlay = false,
  overlapCount = 1,
  overlapIndex = 0,
  rowHeightPx = 64,
}) => {
  // Submenú duración
  const [editingSubmenu, setEditingSubmenu] = useState(false);
  const [startTime, setStartTime] = useState(formatTime(task.start_at));
  const [endTime, setEndTime] = useState(formatTime(task.end_at));

  // Modal detalle
  const [detailOpen, setDetailOpen] = useState(false);
  const [formDesc, setFormDesc] = useState(task.description);
  const [formAssigned, setFormAssigned] = useState(task.asigned_to);
  const [formStart, setFormStart] = useState(formatDateTimeLocal(task.start_at));
  const [formEnd, setFormEnd] = useState(formatDateTimeLocal(task.end_at));
  const [formComments, setFormComments] = useState("");
  const [formSubtasks, setFormSubtasks] = useState<string[]>(
    Array.isArray(task.custom_fields.subtasks)
      ? task.custom_fields.subtasks
      : []
  );

  useEffect(() => {
    if (editingSubmenu) {
      setStartTime(formatTime(task.start_at));
      setEndTime(formatTime(task.end_at));
    }
  }, [editingSubmenu, task]);

  useEffect(() => {
    if (detailOpen) {
      setFormDesc(task.description);
      setFormAssigned(task.asigned_to);
      setFormStart(formatDateTimeLocal(task.start_at));
      setFormEnd(formatDateTimeLocal(task.end_at));
      setFormComments("");
      setFormSubtasks(
        Array.isArray(task.custom_fields.subtasks)
          ? task.custom_fields.subtasks
          : []
      );
    }
  }, [detailOpen, task]);

  // Draggable (llamado siempre, no condicional)
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    disabled: isOverlay,
  });

  // Posición & resize
  const { leftPx, widthPx, setDims, pxToSlots, slotsToMin, snapPx } =
    useTaskPosition(task, slotWidthPx, timeDivision);
  const { onLeftDown, onRightDown } = useTaskResize({
    task,
    leftPx,
    widthPx,
    snapPx,
    pxToSlots,
    slotsToMin,
    setDims,
    onResize,
    managerConfig,
  });

  // Estilos & etiquetas
  const duration = useTaskDuration(task);
  const section = managerConfig.sections.find((s) => s.id === task.type);
  const sectionColor = section?.color ?? "transparent";
  const statusLabels: Record<string, string> = {
    pending: "Pendiente",
    in_progress: "En curso",
    paused: "Pausada",
    finished: "Finalizada",
  };
  const labelStatus = statusLabels[task.status] ?? task.status;

  const GAP = 4;
  const totalGap = (overlapCount - 1) * GAP;
  const barHeight = (rowHeightPx - totalGap) / overlapCount;
  const topOffset = overlapIndex * (barHeight + GAP);

  const style: React.CSSProperties = {
    position: "absolute",
    width: widthPx,
    height: `${barHeight}px`,
    top: `${topOffset}px`,
    left: isOverlay ? undefined : leftPx,
    backgroundColor: sectionColor,
    ...(transform && !isOverlay
      ? { transform: `translate3d(${transform.x}px,0,0)` }
      : {}),
    zIndex: isOverlay ? 30 : 10,
  };

  // Guarda cambio del submenú
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

  // Guarda cambios del dialog
  const handleSaveDetail = (e: FormEvent) => {
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

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <motion.div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            whileHover={!isDragging ? { scale: 1 } : {}}
            whileTap={!isDragging ? { scale: 1 } : { scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setDetailOpen(true);
            }}
            title={`${task.text_to_show} — ${duration} — ${labelStatus}`}
            style={style}
            className={`select-none rounded-sm ${
              isDragging ? "opacity-50" : "cursor-move"
            } overflow-hidden border-t-5 border-purple-500`}
          >
            <div className="relative flex flex-col px-3 py-1 h-full">
              <span className="truncate font-bold text-[13px] uppercase">
                {task.text_to_show}
              </span>
              <Badge className="absolute right-3">
                {task.custom_fields.subtasks?.length ?? 0}
              </Badge>
              <span className="text-[12px] font-semibold">{duration}</span>
              <span className="absolute bottom-0 right-0 px-2 py-1 text-[12px] font-medium uppercase">
                {labelStatus}
              </span>
            </div>
            {!isOverlay && (
              <>
                <div
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={onLeftDown}
                  className="absolute left-0 top-0 w-3 h-full cursor-ew-resize"
                />
                <div
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={onRightDown}
                  className="absolute right-0 top-0 w-3 h-full cursor-ew-resize"
                />
              </>
            )}
          </motion.div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuLabel>Acciones</ContextMenuLabel>

          <ContextMenuSub>
            <ContextMenuSubTrigger onClick={() => setEditingSubmenu(true)}>
              Ajustar duración
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="p-3">
              <div className="space-y-2">
                <div>
                  <Label className="text-sm">Inicio</Label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm">Fin</Label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditingSubmenu(false)}
                  >
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleResizeSave}>
                    Guardar
                  </Button>
                </div>
              </div>
            </ContextMenuSubContent>
          </ContextMenuSub>

          <ContextMenuSeparator />

          <ContextMenuItem onSelect={() => onAction?.(task.id, "Iniciar")}>
            Iniciar
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => onAction?.(task.id, "Pausa")}>
            Pausar
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => onAction?.(task.id, "Finalizar")}>
            Finalizar
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem
            onSelect={() => onDelete?.(task.id)}
            className="text-destructive"
          >
            Eliminar
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Dialog de detalle al doble clic */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles de la tarea</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveDetail} className="space-y-4 pt-2">
            <div>
              <Label htmlFor="desc">Descripción</Label>
              <Input
                id="desc"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="start">Inicio</Label>
                <Input
                  id="start"
                  type="datetime-local"
                  value={formStart}
                  onChange={(e) => setFormStart(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end">Fin</Label>
                <Input
                  id="end"
                  type="datetime-local"
                  value={formEnd}
                  onChange={(e) => setFormEnd(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Asignar a</Label>
              <Select
                defaultValue={formAssigned}
                onValueChange={(v) => setFormAssigned(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona usuario" />
                </SelectTrigger>
                <SelectContent>
                  {managerConfig.sections
                    .flatMap(s => s.users as User[])
                    .map((u: User) => (
                      <SelectItem key={u.UUID} value={u.UUID}>
                        {u.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subtareas</Label>
              <TaskList
                initialTasks={formSubtasks}
                placeholder="Subtarea…"
                onTasksChange={setFormSubtasks}
              />
            </div>
            <div>
              <Label htmlFor="comments">Comentarios</Label>
              <Textarea
                id="comments"
                value={formComments}
                onChange={(e) => setFormComments(e.target.value)}
              />
            </div>
          </form>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDetailOpen(false)}>
              Cerrar
            </Button>
            <Button onClick={handleSaveDetail}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
