// src/components/TaskBar.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import type { TaskDefinition, Timing, User } from "../../types";
import { managerConfig } from "../../data";

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
import { TaskList } from "../../../ui/TaskList";
import { useTaskPosition } from "./hooks/useTaskPosition";
import { useTaskResize } from "./hooks/useTaskResize";
import { useTaskDuration } from "./hooks/useTaskDuration";
import { useTaskMenu } from "./hooks/useTaskMenu";
import { useTaskForm } from "./hooks/useTaskForm";

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
  // Draggable
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
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

  // Etiquetas y estilos
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

  // Calcular superposición
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

  // Hooks extraídos
  const menu = useTaskMenu({ task, onResize, onAction, onDelete });
  const form = useTaskForm({ task, onAction });

  // Conteo de subtareas
  const subtasksCount = Array.isArray(task.custom_fields.subtasks)
    ? task.custom_fields.subtasks.length
    : 0;

  return (
    <>
      {/* Menú contextual */}
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
            onDoubleClick={() => form.setDetailOpen(true)}
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
              {/* Badge solo si hay subtareas */}
              {subtasksCount > 0 && (
                <Badge className="absolute right-3">{subtasksCount}</Badge>
              )}
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
            <ContextMenuSubTrigger onClick={() => menu.setEditingSubmenu(true)}>
              Ajustar duración
            </ContextMenuSubTrigger>
            {menu.editingSubmenu && (
              <ContextMenuSubContent className="p-3 space-y-2">
                <div>
                  <Label className="text-sm">Inicio</Label>
                  <Input
                    type="time"
                    value={menu.startTime}
                    onChange={(e) => menu.setStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm">Fin</Label>
                  <Input
                    type="time"
                    value={menu.endTime}
                    onChange={(e) => menu.setEndTime(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => menu.setEditingSubmenu(false)}
                  >
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={menu.handleResizeSave}>
                    Guardar
                  </Button>
                </div>
              </ContextMenuSubContent>
            )}
          </ContextMenuSub>

          <ContextMenuSeparator />

          <ContextMenuItem onSelect={menu.handleStartAction}>
            Iniciar
          </ContextMenuItem>
          <ContextMenuItem onSelect={menu.handlePauseAction}>
            Pausar
          </ContextMenuItem>
          <ContextMenuItem onSelect={menu.handleFinishAction}>
            Finalizar
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem
            onSelect={menu.handleDelete}
            className="text-destructive"
          >
            Eliminar
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Diálogo de detalle */}
      <Dialog open={form.detailOpen} onOpenChange={form.setDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles de la tarea</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSave} className="space-y-4 pt-2">
            <div>
              <Label htmlFor="desc">Descripción</Label>
              <Input
                id="desc"
                value={form.formDesc}
                onChange={(e) => form.setFormDesc(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="start">Inicio</Label>
                <Input
                  id="start"
                  type="datetime-local"
                  value={form.formStart}
                  onChange={(e) => form.setFormStart(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end">Fin</Label>
                <Input
                  id="end"
                  type="datetime-local"
                  value={form.formEnd}
                  onChange={(e) => form.setFormEnd(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Asignar a</Label>
              <Select
                defaultValue={form.formAssigned}
                onValueChange={(v) => form.setFormAssigned(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona usuario" />
                </SelectTrigger>
                <SelectContent>
                  {managerConfig.sections
                    .flatMap((s) => s.users as User[])
                    .map((u) => (
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
                initialTasks={form.formSubtasks}
                placeholder="Subtarea…"
                onTasksChange={form.setFormSubtasks}
              />
            </div>
            <div>
              <Label htmlFor="comments">Comentarios</Label>
              <Textarea
                id="comments"
                value={form.formComments}
                onChange={(e) => form.setFormComments(e.target.value)}
              />
            </div>
          </form>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => form.setDetailOpen(false)}
            >
              Cerrar
            </Button>
            <Button onClick={form.handleSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
