// src/components/taskbar/DialogStatus.tsx
import { FC, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { TaskDefinition } from "../../../types";

// 1) Creamos un union type con las acciones válidas
export type TaskStatusAction = "Iniciar" | "Pausa" | "Finalizar";

interface DialogStatusProps {
  task: TaskDefinition;
  menuPos: { x: number; y: number };
  onAction: (id: string, action: TaskStatusAction) => void;  // ya no usa any
  onClose: () => void;
}

export const DialogStatus: FC<DialogStatusProps> = ({
  task,
  menuPos,
  onAction,
  onClose,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // 2) Ahora options está tipado correctamente
  const options: Array<{ label: string; action: TaskStatusAction }> = [
    { label: "Iniciar", action: "Iniciar" },
    { label: "Pausar", action: "Pausa" },
    { label: "Finalizar", action: "Finalizar" },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const x = menuPos.x + 8,
        y = menuPos.y - 8;

  return createPortal(
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        ref={ref}
        className="pointer-events-auto absolute bg-white rounded-lg shadow-lg py-2"
        style={{ top: y, left: x, minWidth: 120 }}
      >
        <h4 className="px-4 py-1 font-semibold">Cambiar estatus</h4>
        {options.map(opt => (
          <button
            key={opt.action}
            className="block w-full px-4 py-1 text-left hover:bg-gray-100"
            onClick={() => {
              onAction(task.id, opt.action);
              onClose();
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
};
