'use client';

import React, { FC, KeyboardEvent, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface TaskListProps {
  initialTasks?: string[];
  placeholder?: string;
  onTasksChange?: React.Dispatch<React.SetStateAction<string[]>>;
}

export const TaskList: FC<TaskListProps> = ({
  initialTasks = [],
  placeholder = "Nueva tarea…",
  onTasksChange
}) => {
  const [tasks, setTasks] = useState<string[]>(initialTasks);
  const [input, setInput] = useState("");

  useEffect(() => {
    onTasksChange?.(tasks);
  }, [tasks, onTasksChange]);

  const addTask = () => {
    const text = input.trim();
    if (!text) return;
    setTasks(prev => [...prev, text]);
    setInput("");
  };

  const removeTask = (idx: number) => {
    setTasks(prev => prev.filter((_, i) => i !== idx));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTask();
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label htmlFor="task-input">{placeholder}</Label>
            <Input
              id="task-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
            />
          </div>
          <Button onClick={addTask} disabled={!input.trim()}>Agregar</Button>
        </div>

        <Separator/>

        {tasks.length === 0 ? (
          <p className="text-center text-sm text-gray-500">No hay tareas</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((t, i) => (
              <li key={i} className="flex justify-between items-center px-2 py-1 rounded hover:bg-gray-100">
                <span className="truncate">{t}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTask(i)}
                  aria-label="Eliminar tarea"
                >
                  <X className="h-4 w-4"/>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
