"use client";
import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { DndContext, DragOverlay, rectIntersection } from "@dnd-kit/core";
import { Row, TaskDefinition, Timing, User } from "./types";
import { useDndSensors } from "./hooks/useDndSensors";
import { useTaskDragHandlers } from "./components/taskbar/hooks/useTaskDragHandlers";
import { CurrentTimeIndicator } from "./utils/CurrentTimeIndicator";
import { TaskBar } from "./components/taskbar/TaskBar";
import { QuickTaskModal } from "./components/timelineColumns/QuickTaskModal";
import { TimelineNav, ViewMode } from "./components/timelineNav/TimelineNav";
import { useRows } from "./hooks/useRow";
import { generateColumns } from "./utils/columns";
import { managerConfig, tasks as initialTasks } from "./data/index";
import { HOUR_COLUMN_WIDTH, USER_COL_WIDTH } from "./constants";
import { TableComponent, Tbody, Td, Thead, Tr } from "./components/table";
import { ChevronDown, ChevronRight } from "lucide-react";

export const Table: React.FC = () => {
  const [tasks, setTasks] = useState<TaskDefinition[]>(initialTasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({ userId: "", date: "", hour: 0 });

  // Fecha / vista / scroll
  const [baseDate, setBaseDate] = useState(new Date());
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [displayedDate, setDisplayedDate] = useState(new Date());
  const [daysToShow, setDaysToShow] = useState(managerConfig.days_to_show);
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [loadingMore, setLoadingMore] = useState(false);

  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSections(prev => {
      const copy = new Set(prev);
      if (copy.has(sectionId)) copy.delete(sectionId);
      else copy.add(sectionId);
      return copy;
    });
  }, []);

  // Generar filas
  const rows: Row[] = useRows(tasks, managerConfig, baseDate, daysToShow);

  const containerRef = useRef<HTMLDivElement>(null);
  const firstHourTh = useRef<HTMLTableCellElement>(null);
  const slotWidth = HOUR_COLUMN_WIDTH;
  const [sH, sM] = managerConfig.start_time.split(":" ).map(Number);
  const [eH] = managerConfig.end_time.split(":" ).map(Number);
  const { sensors, snapModifier } = useDndSensors(slotWidth, managerConfig.resize_division);
  const { activeTask, dragHandlers } = useTaskDragHandlers({
    tasks,
    setTasks,
    slotWidthPx: slotWidth,
    snapMinutes: managerConfig.resize_division,
    managerConfig,
  });

  // --- Acción: mover/editar/estado ---
  const handleResize = useCallback((id: string, timing: Timing) => {
    setTasks(ts =>
      ts.map(t =>
        t.id !== id
          ? t
          : {
              ...t,
              start_at: new Date(
                t.start_at.getFullYear(),
                t.start_at.getMonth(),
                t.start_at.getDate(),
                timing.startHour,
                timing.startMinute
              ),
              end_at: new Date(
                t.end_at.getFullYear(),
                t.end_at.getMonth(),
                t.end_at.getDate(),
                timing.endHour,
                timing.endMinute
              ),
            }
      )
    );
  }, []);

  // Eliminado handleDelete (no se usa)

  const handleAction = useCallback(
    (
      id: string,
      action: "update" | "Iniciar" | "Pausa" | "Finalizar",
      payload?: Partial<TaskDefinition>
    ) => {
      setTasks(ts =>
        ts.map(t => {
          if (t.id !== id) return t;
          switch (action) {
            case "update":
              return { ...t, ...payload };
            case "Iniciar":
              return { ...t, status: "in_progress" };
            case "Pausa":
              return { ...t, status: "paused" };
            case "Finalizar":
              return { ...t, status: "finished" };
          }
        })
      );
    },
    []
  );

  // --- Prev / Next / Today / Cambio de vista ---
  const handlePrev = useCallback(() => {
    const x = new Date(baseDate);
    x.setDate(x.getDate() - 1);
    setBaseDate(x);
    setDisplayedDate(x);
  }, [baseDate]);

  const handleNext = useCallback(() => {
    const x = new Date(baseDate);
    x.setDate(x.getDate() + 1);
    setBaseDate(x);
    setDisplayedDate(x);
  }, [baseDate]);

  const handleToday = useCallback(() => {
    const today = new Date();
    setBaseDate(today);
    setDisplayedDate(today);
    setViewMode("day");
    setDaysToShow(managerConfig.days_to_show);
  }, []);

  const handleViewChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    if (mode === "day") {
      setDaysToShow(1);
      const today = new Date();
      setBaseDate(today);
      setDisplayedDate(today);
    } else if (mode === "week") {
      setDaysToShow(7);
      const today = new Date();
      setBaseDate(today);
      setDisplayedDate(today);
    }
  }, []);

  // Cuando scroll desplazas vista
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let timer: NodeJS.Timeout;
    const totalHours = eH - sH + 1;
    const dayWidth = totalHours * slotWidth;

    const onScroll = () => {
      if (!loadingMore && el.scrollLeft + el.clientWidth >= el.scrollWidth - 100) {
        setLoadingMore(true);
        timer = setTimeout(() => {
          setDaysToShow(n => n + 1);
          setLoadingMore(false);
        }, 800);
      }
      const dayOffset = Math.floor(el.scrollLeft / dayWidth);
      const visible = new Date(baseDate);
      visible.setDate(baseDate.getDate() + dayOffset);
      setDisplayedDate(visible);
    };

    el.addEventListener("scroll", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, [loadingMore, baseDate, daysToShow, sH, eH, slotWidth]);

  // Columnas dinámicas
  const columns = useMemo(
    () =>
      generateColumns(
        managerConfig,
        slotWidth,
        handleResize,
        (id, newU) => handleAction(id, "update", { asigned_to: newU }),
        () => {},
        baseDate,
        daysToShow,
        (u, d, h) => {
          setModalInfo({ userId: u, date: d, hour: h });
          setModalOpen(true);
        }
      ),
    [baseDate, daysToShow, handleResize, handleAction, slotWidth]
  );

  return (
    <>
      <TimelineNav
        currentDate={displayedDate}
        viewMode={viewMode}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onViewChange={handleViewChange}
        onDateChange={d => {
          setViewMode("day");
          setDaysToShow(1);
          setBaseDate(d);
          setDisplayedDate(d);
        }}
      />

      <div className="relative">
        {loadingMore && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white px-3 py-1 rounded shadow">
            Cargando...
          </div>
        )}
        <div ref={containerRef} className="overflow-x-auto relative">
          <CurrentTimeIndicator
            startHour={sH + sM / 60}
            endHour={eH}
            hourWidth={slotWidth}
            daysToShow={daysToShow}
            containerRef={containerRef}
            xOffset={USER_COL_WIDTH}
            color="#8e44ad"
          />

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

            <TableComponent className="min-w-full border-separate" style={{ borderSpacing: 0 }}>
              <Thead>
                <Tr>
                  {columns.map((col, i) => (
                    <th
                      key={col.field}
                      ref={i === 1 ? firstHourTh : undefined}
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
                {managerConfig.sections.map(section => {
                  const isCollapsed = collapsedSections.has(section.id);
                  return (
                    <React.Fragment key={section.id}>
                      <Tr className="bg-slate-200 uppercase font-medium">
                        <Td colSpan={columns.length} className="px-2 py-1 text-lg">
                          <div className="flex items-center gap-2">
                            <span>{section.name}</span>
                            {isCollapsed ? (
                              <ChevronRight
                                size={24}
                                className="cursor-pointer"
                                onClick={() => toggleSection(section.id)}
                              />
                            ) : (
                              <ChevronDown
                                size={24}
                                className="cursor-pointer"
                                onClick={() => toggleSection(section.id)}
                              />
                            )}
                          </div>
                        </Td>
                      </Tr>
                      {!isCollapsed &&
                        rows
                      .filter((r) => r.sectionId === section.id)
                      .map((row) => (
                        <Tr key={row.userId} className="bg-gray-50">
                          {columns.map((col, idx) =>
                            idx === 0
                              ? React.cloneElement(
                                  col.renderCell(row) as React.ReactElement,
                                  {
                                    ...(React.isValidElement(
                                      col.renderCell(row)
                                    ) && col.renderCell(row).props.className
                                      ? {
                                          className:
                                            col.renderCell(row).props
                                              .className +
                                            " sticky left-0 z-10 bg-white",
                                        }
                                      : {
                                          className:
                                            "sticky left-0 z-10 bg-white",
                                        }),
                                  }
                                )
                              : col.renderCell(row)
                          )}
                        </Tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </Tbody>
            </TableComponent>
          </DndContext>
        </div>
      </div>

      <QuickTaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={task => {
          // tipado User en users
          const sec = managerConfig.sections.find(sec =>
            (sec.users as User[]).some(u => u.UUID === task.asigned_to)
          );
          setTasks(ts => [...ts, { ...task, type: sec?.id ?? "" }]);
        }}
        userId={modalInfo.userId}
        date={modalInfo.date}
        hour={modalInfo.hour}
        defaultDuration={managerConfig.time_division}
      />
    </>
  );
};