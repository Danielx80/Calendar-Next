"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
import { DndContext, DragOverlay, rectIntersection } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Row, TaskDefinition, User } from "./types";
import { TimelineNav } from "./components/timelineNav/TimelineNav";
import { TaskBar } from "./components/taskbar/TaskBar";
import { QuickTaskModal } from "./components/timelineColumns/QuickTaskModal";
import { TableComponent, Thead, Tbody, Tr, Td } from "./components/table";
import { useRows } from "./hooks/useRow";
import { useDndSensors } from "./hooks/useDndSensors";
import { useTaskDragHandlers } from "./components/taskbar/hooks/useTaskDragHandlers";
import { generateColumns } from "./utils/columns";
import { useCalendarState } from "./hooks/useCalendarState";
import { useInfiniteDaysScroll } from "./hooks/useInfiniteDaysScroll";
import { useTaskActions } from "./hooks/useTaskActions";
import { CurrentTimeIndicator } from "./utils/CurrentTimeIndicator";
import { managerConfig, tasks as initialTasks } from "./data/index";
import { HOUR_COLUMN_WIDTH, USER_COL_WIDTH } from "./constants";

export const Table: React.FC = () => {
  const slotWidth = HOUR_COLUMN_WIDTH;

  // --- Tasks & QuickTaskModal state ---
  const [tasks, setTasks] = useState<TaskDefinition[]>(initialTasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState<{
    userId: string;
    date: string;
    hour: number;
  }>({
    userId: "",
    date: "",
    hour: 0,
  });

  // --- Calendar state (fecha, vista, días a mostrar) ---
  const {
    baseDate,
    displayedDate,
    viewMode,
    daysToShow,
    goPrev,
    goNext,
    goToday,
    changeView,
    onDateSelect,
    setDisplayedDate,
    setDaysToShow,
  } = useCalendarState(managerConfig.days_to_show);

  // --- Infinite scroll de días ---
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sH, sM] = managerConfig.start_time.split(":").map(Number);
  const [eH] = managerConfig.end_time.split(":").map(Number);

  useInfiniteDaysScroll({
    containerRef,
    baseDate,
    startHour: sH + sM / 60,
    endHour: eH,
    slotWidth,
    loadingMore,
    setLoadingMore,
    setDaysToShow,
    setDisplayedDate,
  });

  // --- Task actions (resize & status changes) ---
  const { handleResize, handleAction } = useTaskActions(setTasks);

  // --- Rows & Columns ---
  const rows: Row[] = useRows(tasks, managerConfig, baseDate, daysToShow);
  const columns = useMemo(
    () =>
      generateColumns(
        managerConfig,
        slotWidth,
        handleResize,
        (id, newUser) => handleAction(id, "update", { asigned_to: newUser }),
        () => {}, // onTaskClick (no-op)
        baseDate,
        daysToShow,
        (userId, date, hour) => {
          setModalInfo({ userId, date, hour });
          setModalOpen(true);
        }
      ),
    [baseDate, daysToShow, handleResize, handleAction]
  );

  // --- DnD setup ---
  const { sensors, snapModifier } = useDndSensors(
    slotWidth,
    managerConfig.resize_division
  );
  const { activeTask, dragHandlers } = useTaskDragHandlers({
    tasks,
    setTasks,
    slotWidthPx: slotWidth,
    snapMinutes: managerConfig.resize_division,
    managerConfig,
  });

  // --- Collapse sections state ---
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set()
  );
  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSections((prev) => {
      const copy = new Set(prev);
      copy.has(sectionId) ? copy.delete(sectionId) : copy.add(sectionId);
      return copy;
    });
  }, []);

  return (
    <>
      <TimelineNav
        currentDate={displayedDate}
        viewMode={viewMode}
        onPrev={goPrev}
        onNext={goNext}
        onToday={goToday}
        onViewChange={changeView}
        onDateChange={onDateSelect}
      />

      <div className="relative">
        {/* Indicador de carga al hacer scroll */}
        {loadingMore && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white px-3 py-1 rounded shadow">
            Cargando...
          </div>
        )}

        <div ref={containerRef} className="overflow-x-auto relative">
          {/* Líneas guía para cada día */}
          {Array.from({ length: daysToShow + 1 }).map((_, i) => {
            const totalHours = eH - sH + 1;
            const dayWidth = totalHours * slotWidth;
            return (
              <div
                key={i}
                className="absolute border-s-purple-500 border-dashed border-1 top-0 bottom-0 z-10 select-none"
                style={{ left: USER_COL_WIDTH + i * dayWidth }}
              />
            );
          })}

          {/* Indicador de hora actual */}
          <CurrentTimeIndicator
            startHour={sH + sM / 60}
            endHour={eH}
            hourWidth={slotWidth}
            daysToShow={daysToShow}
            containerRef={containerRef}
            xOffset={USER_COL_WIDTH}
            color="#8e44ad"
          />

          {/* Área DnD */}
          <DndContext
            sensors={sensors}
            modifiers={[snapModifier]}
            collisionDetection={rectIntersection}
            onDragStart={dragHandlers.onDragStart}
            onDragMove={dragHandlers.onDragMove}
            onDragEnd={dragHandlers.onDragEnd}
            onDragCancel={dragHandlers.onDragCancel}
          >
            <DragOverlay style={{ pointerEvents: "none", zIndex: 999 }}>
              {activeTask && (
                <TaskBar
                  task={activeTask}
                  slotWidthPx={slotWidth}
                  timeDivision={managerConfig.resize_division}
                  onResize={handleResize}
                  isOverlay
                />
              )}
            </DragOverlay>
          

            {/* Tabla principal */}
            <TableComponent
              className="min-w-full border-separate"
              style={{ borderSpacing: 0 }}
            >
              <Thead>
                <Tr>
                  {columns.map((col, i) => (
                    <th
                      key={col.field}
                      className={`py-2 border-slate-200 border text-gray-700 uppercase sticky top-0 bg-slate-50 ${
                        i === 0 ? "sticky left-0 z-20 bg-white" : ""
                      }`}
                      style={{ minWidth: col.width }}
                    >
                      {col.headerName}
                    </th>
                  ))}
                </Tr>
              </Thead>

              <Tbody>
                {}
                {managerConfig.sections.map((section) => {
                  const isCollapsed = collapsedSections.has(section.id);
                  return (
                    <React.Fragment key={section.id}>
                      {/* Encabezado de sección */}
                      <Tr className="bg-slate-200 uppercase font-medium">
                        <Td
                          colSpan={columns.length}
                          className="px-2 py-1 text-lg border-1 border-slate-300"
                        >
                          <div className="flex items-center gap-2">
                            <span>{section.name}</span>
                            {isCollapsed ? (
                              <ChevronRight
                                onClick={() => toggleSection(section.id)}
                                className="cursor-pointer"
                              />
                            ) : (
                              <ChevronDown
                                onClick={() => toggleSection(section.id)}
                                className="cursor-pointer"
                              />
                            )}
                          </div>
                        </Td>
                      </Tr>

                      {/* Filas de usuarios */}
                      <AnimatePresence initial={false}>
                        {!isCollapsed &&
                          rows
                            .filter((r) => r.sectionId === section.id)
                            .map((row) => (
                              <motion.tr
                                key={row.userId}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-gray-50"
                              >
                                {columns.map((col, idx) =>
                                  idx === 0
                                    ? React.cloneElement(
                                        col.renderCell(
                                          row
                                        ) as React.ReactElement,
                                        {
                                          className: `${
                                            (col.renderCell(row) as any).props
                                              .className || ""
                                          } sticky left-0 z-10 bg-white`,
                                        }
                                      )
                                    : col.renderCell(row)
                                )}
                              </motion.tr>
                            ))}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </Tbody>
            </TableComponent>
          </DndContext>
        </div>
      </div>

      {/* Modal de creación rápida */}
      <QuickTaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={(task) => {
          const sec = managerConfig.sections.find((sec) =>
            (sec.users as User[]).some((u) => u.UUID === task.asigned_to)
          );
          setTasks((ts) => [...ts, { ...task, type: sec?.id ?? "" }]);
        }}
        userId={modalInfo.userId}
        date={modalInfo.date}
        hour={modalInfo.hour}
        defaultDuration={managerConfig.time_division}
      />
    </>
  );
};
