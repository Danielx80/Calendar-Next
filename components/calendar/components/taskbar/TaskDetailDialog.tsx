import React from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { TaskList } from "../../../ui/TaskList";
import { TaskDefinition, User } from "../../types";
import { useTaskForm } from "./hooks/useTaskForm";
import { managerConfig } from "../../data";


interface TaskDetailDialogProps {
  task: TaskDefinition;
  onAction?: (id: string, action: string, payload?: Record<string, unknown>) => void;
}

export const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({ task, onAction }) => {
  const {
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
  } = useTaskForm({ task, onAction });

  return (
    <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalles de la tarea</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div>
            <Label htmlFor="desc">Descripción</Label>
            <Input id="desc" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
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
            <Select defaultValue={formAssigned} onValueChange={(v) => setFormAssigned(v)}>
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
          <Button onClick={handleSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
