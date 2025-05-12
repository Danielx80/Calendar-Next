// src/components/ui/ButtonGroup.tsx
import React from "react";
import { Button } from "@/components/ui/button";

interface Option {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface ButtonGroupProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

interface Option {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface ButtonGroupProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  options,
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`inline-flex rounded-lg shadow-sm ${className}`}>
      {options.map((opt, i) => {
        const isFirst = i === 0;
        const isLast = i === options.length - 1;
        const active = opt.value === value;

        return (
          <Button
            key={opt.value}
            type="button"
            variant={active ? "default" : "outline"}
            onClick={() => onChange(opt.value)}
            className={`
			  flex-1
			  min-w-0
              rounded-none 
              ${isFirst ? "rounded-l-md" : ""}
              ${isLast ? "rounded-r-md" : ""}
              ${!isFirst ? "-ml-px" : ""}
              focus:z-10
              transition-all
              overflow-hidden 
              truncate 
              whitespace-nowrap
            `}
          >
            {opt.icon && <span>{opt.icon}</span>}
            {opt.label}
          </Button>
        );
      })}
    </div>
  );
};
