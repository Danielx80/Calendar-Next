import React from "react";
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
import { Button } from "@/components/ui/button";
import { TaskDefinition, Timing } from "../../types";
import { useTaskMenu } from "./hooks/useTaskMenu";


interface TaskContextMenuProps {
  task: TaskDefinition;
  onResize?: (id: string, timing: Timing) => void;
  onAction?: (id: string, action: string, payload?: Record<string, unknown>) => void;
  onDelete?: (id: string) => void;
  onClick?: () => void;
  openDetail: () => void;
  children: React.ReactNode;
}

export const TaskContextMenu: React.FC<TaskContextMenuProps> = ({
  task,
  onResize,
  onAction,
  onDelete,
  onClick,
  openDetail,
  children,
}) => {
  const {
    editingSubmenu,
    startTime,
    endTime,
    setStartTime,
    setEndTime,
    setEditingSubmenu,
    handleResizeSave,
    handleStartAction,
    handlePauseAction,
    handleFinishAction,
    handleDelete,
  } = useTaskMenu({ task, onResize, onAction, onDelete });

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div onClick={onClick} onDoubleClick={openDetail}>
          {children}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Acciones</ContextMenuLabel>

        <ContextMenuSub>
          <ContextMenuSubTrigger onClick={() => setEditingSubmenu(true)}>
            Ajustar duración
          </ContextMenuSubTrigger>
          {editingSubmenu && (
            <ContextMenuSubContent className="p-3">
              <div className="space-y-2">
                <div>
                  <label className="text-sm">Inicio</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm">Fin</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
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
          )}
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuItem onSelect={handleStartAction}>Iniciar</ContextMenuItem>
        <ContextMenuItem onSelect={handlePauseAction}>Pausar</ContextMenuItem>
        <ContextMenuItem onSelect={handleFinishAction}>Finalizar</ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onSelect={handleDelete} className="text-destructive">
          Eliminar
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
