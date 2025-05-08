"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { TaskDefinition, User } from "../../types";
import { managerConfig } from "../../data/index";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface QuickTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: TaskDefinition) => void;
  userId: string;
  date: string;
  hour: number;
  defaultDuration: number;
}

function formatLocalISO(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export const QuickTaskModal: React.FC<QuickTaskModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  userId,
  date,
  hour,
  defaultDuration,
}) => {
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState(userId);
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");

  const userOptions = managerConfig.sections.flatMap((section) =>
    section.users.map((u: User) => ({ value: u.UUID, label: u.name }))
  );

  useEffect(() => {
    const start = new Date(`${date}T${String(hour).padStart(2, "0")}:00`);
    const end = new Date(start.getTime() + defaultDuration * 60000);
    setStartInput(formatLocalISO(start));
    setEndInput(formatLocalISO(end));
    setDescription("");
    setAssignedTo(userId);
  }, [isOpen, date, hour, defaultDuration, userId]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const startAt = new Date(startInput);
    const endAt = new Date(endInput);
    const durationMins = Math.round((endAt.getTime() - startAt.getTime()) / 60000);
    const newTask: TaskDefinition = {
      id: uuidv4(),
      type: "",
      sub_type: "",
      description: description || "Tarea rápida",
      asigned_to: assignedTo,
      start_at: startAt,
      end_at: endAt,
      due_date: endAt,
      duration: durationMins.toString(),
      planned_at: startAt,
      priority: "medium",
      order_id: "",
      status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
      is_active: true,
      is_productive: true,
      text_to_show: description,
      config: {
        allow_attached_files: true,
        allow_comments: true,
        max_comments: 5,
        max_comment_length: 200,
        max_files: 3,
        allow_recurrence: false,
        allow_resizing_up: true,
        allow_resizing_down: true,
        allow_concurrent_tasks: false,
        allow_subtasks: true,
        allow_time_tracking: true,
      },
      custom_fields: {},
    };
    onCreate(newTask);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva tarea rápida</DialogTitle>
        </DialogHeader>

        <form id="quick-task-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Título (placa u orden)</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej. ABC-1234"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium">Inicio</label>
              <Input
                type="datetime-local"
                value={startInput}
                onChange={(e) => setStartInput(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">Fin</label>
              <Input
                type="datetime-local"
                value={endInput}
                onChange={(e) => setEndInput(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Asignar a</label>
            <Select onValueChange={(v) => setAssignedTo(v)} defaultValue={assignedTo}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona usuario..." />
              </SelectTrigger>
              <SelectContent>
                {userOptions.map((u) => (
                  <SelectItem key={u.value} value={u.value}>
                    {u.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium">Comentarios</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles adicionales..."
            />
          </div>
        </form>

        <DialogFooter className="space-x-2">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="quick-task-form">
            Agregar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
