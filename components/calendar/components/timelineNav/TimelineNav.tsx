"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

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
                {currentDate.toISOString().slice(0, 10)}
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

        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={handleToggle}
          className="bg-white rounded-md p-1"
        >
          <ToggleGroupItem
            value="day"
            aria-label="Vista día"
            className="px-3 py-1 rounded data-[state=on]:bg-black data-[state=on]:text-white"
          >
            Día
          </ToggleGroupItem>
          <ToggleGroupItem
            value="week"
            aria-label="Vista semana"
            className="px-3 py-1 rounded data-[state=on]:bg-black data-[state=on]:text-white"
          >
            Semana
          </ToggleGroupItem>
          <ToggleGroupItem
            value="month"
            aria-label="Vista mes"
            className="px-3 py-1 rounded data-[state=on]:bg-black data-[state=on]:text-white"
          >
            Mes
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};
