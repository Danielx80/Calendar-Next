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
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { TaskList } from "../../../ui/TaskList";
import { ButtonGroup } from "@/components/ui/ButtonGroup";
import { Camera, CirclePause, CircleStop, Play, Search } from "lucide-react";

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

const options = [
  { label: "Iniciar", value: "iniciar", icon: <Play className="h-4 w-4" /> },
  { label: "Pausar", value: "pausar", icon: <CirclePause className="h-4 w-4" /> },
  { label: "Detener", value: "finalizar", icon: <CircleStop className="h-4 w-4" /> },
];

export const QuickTaskModal: React.FC<QuickTaskModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  userId,
  date,
  hour,
  defaultDuration,
}) => {
  const [orderId, setOrderId] = useState("");
  const [operationType, setOperationType] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState(userId);
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [action, setAction] = useState<string>("");
    const [subtasks, setSubtasks] = useState<string[]>([]);

  const operationOptions = [
    { label: "Mantenimiento", value: "mantenimiento" },
    { label: "Diagnóstico", value: "diagnostico" },
    { label: "Reparación", value: "reparacion" },
    { label: "Calidad y auditoría", value: "calidadAuditoria" },
    { label: "Alineación y Balanceo", value: "alineacionBalanceo" },
    { label: "No productivas", value: "noProductivas" },
    { label: "Hojalatería y pintura", value: "hojalateriaPintura" },
    { label: "Recepción Vehículo", value: "recepcionVehiculo" },
    { label: "Entrega Vehículo", value: "entregaVehiculo" },
    { label: "Lavado", value: "lavado" },
  ];

  const userOptions = managerConfig.sections.flatMap((section) =>
    section.users.map((u: User) => ({ value: u.UUID, label: u.name }))
  );

  const handleActionChange = (value: string) => {
    setAction(value);
  };

  useEffect(() => {
    const start = new Date(`${date}T${String(hour).padStart(2, "0")}:00`);
    const end = new Date(start.getTime() + defaultDuration * 60000);
   setStartInput(formatLocalISO(start));
      setEndInput(formatLocalISO(end));
      setOrderId("");
      setOperationType("");
      setDescription("");
      setAssignedTo(userId);
      setSubtasks([]);
      setAction("");
  }, [isOpen, date, hour, defaultDuration, userId]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const startAt = new Date(startInput);
    const endAt = new Date(endInput);
    const durationMins = Math.round(
      (endAt.getTime() - startAt.getTime()) / 60000
    );

    const newTask: TaskDefinition = {
      id: uuidv4(),
      type: operationType,
      sub_type: operationType,
      description,
      asigned_to: assignedTo,
      start_at: startAt,
      end_at: endAt,
      due_date: endAt,
      duration: durationMins.toString(),
      planned_at: startAt,
      priority: "medium",
      order_id: orderId,
      status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
      is_active: true,
      is_productive: true,
      text_to_show: orderId,
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
      custom_fields: { subtasks },
      subTask: []
    };

    onCreate(newTask);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="space-x-2">
        <Tabs className="space-y-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Agregar Tarea</TabsTrigger>
            <TabsTrigger value="event">No productiva</TabsTrigger>
          </TabsList>

          <DialogHeader>
            <DialogTitle>
              Agregar nueva tarea / Detalle de tarea - No productiva
            </DialogTitle>
            <DialogDescription>
              Agrega una nueva tarea, y selecciona hora y fecha. / Agrega uan
              tarea no productiva, estas se veran en el tablero como una celda
              no dispobible.
            </DialogDescription>
          </DialogHeader>
          <TabsContent value="account">
            <form
              id="quick-task-form"
              onSubmit={handleSubmit}
              className="space-y-2"
            >
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Buscar por Orden, VIN o Placa..."
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-900" />
              </div>
              <div className="flex gap-2 space-y-1">
                <Input
                  id="order_id"
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="15698 - APK598"
                />
                <Button type="button">Detalles del vehiculo</Button>
              </div>
              <div className="space-y-1">
                <Label>Operación</Label>
                <Select value={operationType} onValueChange={setOperationType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona operación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Operaciones disponibles</SelectLabel>
                      {operationOptions.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <div className="space-y-1">
                  <Label htmlFor="start_at">Hora de Inicio</Label>
                  <Input
                    id="start_at"
                    type="datetime-local"
                    value={startInput}
                    onChange={(e) => setStartInput(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="end_at">Hora de Fin</Label>
                  <Input
                    id="end_at"
                    type="datetime-local"
                    value={endInput}
                    onChange={(e) => setEndInput(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Operador</Label>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Usuarios</SelectLabel>
                      {userOptions.map((u) => (
                        <SelectItem key={u.value} value={u.value}>
                          {u.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <TaskList
                initialTasks={subtasks}
                onTasksChange={setSubtasks}
                placeholder="Subtareas..."
              />

              <div className="space-y-1">
                <Label>Descripción</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción de la tarea"
                />
              </div>
            </form>
          </TabsContent>
          <TabsContent value="event">
            <form action="" className="space-y-2">
              <div className="flex justify-between ">
                <div className="flex flex-col space-y-1">
                  <Label>Nombre de la tarea</Label>
                  <Input placeholder="Escribe la tarea" className="w-94" />
                </div>
                <Button type="button">
                  <Camera size={48} />
                </Button>
              </div>
              <div className="flex gap-2">
                <div className="space-y-1">
                  <Label>Hora de Inicio</Label>
                  <Input type="datetime-local" />
                </div>

                <div className="space-y-1">
                  <Label>Hora de fin</Label>
                  <Input type="datetime-local" />
                </div>
              </div>

              <div className="flex flex-col space-y-2 mb-2">
                <Label>Estatus de la tarea</Label>
                <ButtonGroup
                  className="w-full"
                  options={options}
                  value={action}
                  onChange={handleActionChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Comentarios o solicitudes adicionales</Label>
                <Textarea
                value={description}
                placeholder="Descripcion de la tarea o comentarios"
                onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </form>
          </TabsContent>
          <DialogFooter className="space-x-2">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" form="quick-task-form">
              Agregar
            </Button>
          </DialogFooter>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
