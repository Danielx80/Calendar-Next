"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDateKey } from "../../helpers/dayUtils";
import { ButtonGroup } from "@/components/ui/ButtonGroup";

export type ViewMode = "day" | "week" | "month";

interface Props {
  currentDate: Date;
  viewMode: ViewMode;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (mode: ViewMode) => void;
  onDateChange: (date: Date) => void;
}

export const TimelineNav: React.FC<Props> = ({
  currentDate,
  viewMode,
  onPrev,
  onNext,
  onToday,
  onViewChange,
  onDateChange,
}) => {
  const headerTitle = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
    .format(currentDate)
    .replace(/^\w/, (c) => c.toUpperCase());

  const viewOptions = [
    { label: "Día", value: "day" },
    { label: "Semana", value: "week" },
    { label: "Mes", value: "month" },
  ];

  const handleToggle = (value: ViewMode) => {
    if (value === "day") onToday();
    else onViewChange(value);
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between bg-slate-200 p-2 rounded-md shadow">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={onPrev}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-[120px] justify-start">
                {formatDateKey(currentDate)}
                <CalendarIcon className="ml-6 h-4 w-4 text-gray-600" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={(date) => date && onDateChange(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon" onClick={onNext}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <h2 className="text-lg font-semibold text-gray-700">{headerTitle}</h2>
        <ButtonGroup
          value={viewMode}
          onChange={(val) => handleToggle(val as ViewMode)}
          options={viewOptions}
        />
      </div>
    </div>
  );
};
