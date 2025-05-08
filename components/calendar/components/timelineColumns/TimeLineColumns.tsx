import { Row, TaskManager, Timing } from "../../types";
import { toMinuteRange } from "../../helpers/disabledRanges";
import { TaskBar } from "../taskbar/TaskBar";
import { formatDateKey } from "../../helpers/dayUtils";
import { DroppableCell } from "../table";

interface TimeLineColumnsArgs {
  config: TaskManager;
  slotWidthPx: number;
  updateTask: (id: string, timing: Timing) => void;
  onTaskClick: (id: string) => void;
  onCellClick?: (userId: string, date: string, hour: number) => void;
  startDate: Date;
  daysToShow: number;
}

export const TimeLineColumns = ({
  config,
  slotWidthPx: hourWidth,
  updateTask,
  onTaskClick,
  onCellClick,
  startDate,
  daysToShow,
}: TimeLineColumnsArgs) => {
  const subdivPx = Math.round((hourWidth * config.time_division) / 60);
  const resizeDivision = config.resize_division;
  const [startHour] = config.start_time.split(":").map(Number);
  const [endHour] = config.end_time.split(":").map(Number);
  const totalHours = endHour - startHour + 1;

  return Array.from({ length: daysToShow }, (_, dayIdx) => {
    const dayDate = new Date(startDate);
    dayDate.setDate(dayDate.getDate() + dayIdx);
    dayDate.setHours(0, 0, 0, 0);
    const dateStr = formatDateKey(dayDate);

    return Array.from({ length: totalHours }, (_, hIdx) => {
      const hour = startHour + hIdx;
      const blockStart = hour * 60; // en minutos desde medianoche

      return {
        field: `${dateStr}_${hour}`,
        headerName: `${String(hour).padStart(2, "0")}:00`,
        width: hourWidth,
        dateStr,
        renderCell: (row: Row) => {
          // 1) extraer todos los rangos deshabilitados de este día
          const minuteRanges = (row.disabledRanges ?? [])
            .filter((r) => formatDateKey(r.startDate) === dateStr)
            .map((r) => toMinuteRange(r)); // { start, end } en minutos

          // 2) fusionar rangos solapados o contiguos
          const merged = minuteRanges
            .sort((a, b) => a.start - b.start)
            .reduce<{ start: number; end: number }[]>((acc, cur) => {
              if (!acc.length) return [{ ...cur }];
              const last = acc[acc.length - 1];
              // si se tocan o solapan, extiendo
              if (cur.start <= last.end + 0) {
                last.end = Math.max(last.end, cur.end);
              } else {
                acc.push({ ...cur });
              }
              return acc;
            }, []);

          // 3) calcular segmentos relativos a las celdas
          const segments = merged.map((r) => {
            const startRel = r.start - startHour * 60; // minutos desde inicio de row
            const duration = r.end - r.start; // minutos totales del segmento
            const startCell = Math.floor(startRel / 60); // índice de celda donde arranca
            const offsetMin = startRel % 60; // minutos dentro de esa celda
            return { startCell, offsetMin, duration };
          });

          // 4) tareas y solapamientos (igual que antes)
          const tasksOnDate = row.tasks.filter(
            (t) => formatDateKey(t.start_at) === dateStr
          );
          const overlapMap: Record<string, { count: number; index: number }> =
            {};
          tasksOnDate.forEach((t) => {
            const s = t.start_at.getHours() * 60 + t.start_at.getMinutes();
            const e = t.end_at.getHours() * 60 + t.end_at.getMinutes();
            const group = tasksOnDate
              .filter(
                (u) =>
                  !(
                    e <= u.start_at.getHours() * 60 + u.start_at.getMinutes() ||
                    s >= u.end_at.getHours() * 60 + u.end_at.getMinutes()
                  )
              )
              .sort((a, b) => a.start_at.getTime() - b.start_at.getTime());
            overlapMap[t.id] = {
              count: group.length,
              index: group.findIndex((x) => x.id === t.id),
            };
          });

          return (
            <DroppableCell
              key={`${dateStr}-${row.userId}-cell-${hIdx}`}
              id={`time-${dateStr}_${hour}-user-${row.userId}`}
              disabled={false}
              className="relative h-16 border-l-0"
              style={{
                width: hourWidth,
                overflow: "visible",
                backgroundSize: `${subdivPx}px 100%`,
                backgroundImage:
                  "linear-gradient(to right, transparent calc(100% - 1px), #e5e7eb 1px)",
                //Linea divisora de final del dia
                borderRight:
                  hIdx === totalHours - 1 ? "2px solid #ccc" : undefined,
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickedMin = blockStart + (clickX / hourWidth) * 60;
                const minuteRangesDay = minuteRanges;
                if (
                  minuteRangesDay.some(
                    (r) => clickedMin >= r.start && clickedMin < r.end
                  ) ||
                  tasksOnDate.some((t) => t.start_at.getHours() === hour)
                )
                  return;
                e.stopPropagation();
                onCellClick?.(row.userId, dateStr, hour);
              }}
            >
              {segments.map((seg, i) => {
                if (seg.startCell !== hIdx) return null;
                const leftPx = (seg.offsetMin / 60) * hourWidth;
                const widthPx = (seg.duration / 60) * hourWidth;
                return (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 border-r-2 border-l bg-slate-200 border-slate-300 flex items-center text-center text-sm justify-center z-9 pointer-events-none"
                    style={{
                      left: leftPx,
                      width: widthPx,
                    }}
                  >
                    <span className="text-xs font-medium text-slate-700 select-none">
                      No disponible
                    </span>
                  </div>
                );
              })}

              {tasksOnDate
                .filter((t) => t.start_at.getHours() === hour)
                .map((t) => {
                  const { count, index } = overlapMap[t.id];
                  return (
                    <TaskBar
                      key={t.id}
                      task={t}
                      slotWidthPx={hourWidth}
                      timeDivision={resizeDivision}
                      onResize={updateTask}
                      onClick={() => onTaskClick(t.id)}
                      overlapCount={count}
                      overlapIndex={index}
                      rowHeightPx={60}
                    />
                  );
                })}
            </DroppableCell>
          );
        },
      };
    });
  }).flat();
};