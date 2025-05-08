"user-client";
import React from "react";
import { useDroppable } from "@dnd-kit/core";

interface DroppableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  id: string;
  disabled?: boolean;
}

export const DroppableCell: React.FC<DroppableCellProps> = ({
  id,
  children,
  className = "",
  style,
  disabled = false,
  onClick,
  ...rest
}) => {
  const { setNodeRef, isOver } = useDroppable({ 
    id,
    disabled 
  });

  // Clases condicionales
  const baseClasses = "h-16 border-1 border-slate-300 relative ";
  const disabledClasses = "bg-slate-200 cursor-not-allowed";
  const droppableClasses = !disabled 
    ? "hover:bg-slate-100 bg-white cursor-cell" 
    : "";
  const highlightClasses = isOver ? "bg-blue-100" : "";

  return (
    <td
      id={id}
      ref={disabled ? undefined : setNodeRef}
      className={`${baseClasses} ${disabled ? disabledClasses : droppableClasses} ${highlightClasses} ${className}`}
      style={{
        ...style,
        pointerEvents: disabled ? "none" : "auto",
      }}
      onClick={(e) => {
        if (disabled) return;
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </td>
  );
};