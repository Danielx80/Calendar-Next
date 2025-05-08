import type { TaskManager, Timing } from "../types";
import { TimeLineColumns } from "../components/timelineColumns/TimeLineColumns";
import { UserColumn } from "../components/userColumns/UserColumn";

export function generateColumns(
  config: TaskManager,
  slotWidthPx: number,
  updateTask: (id: string, timing: Timing) => void,
  _moveTaskToUser: (id: string, newUserId: string) => void,
  onTaskClick: (id: string) => void,
  startDate: Date,
  daysToShow: number,
  onCellClick?: (userId: string, date: string, hour: number) => void
) {
  const userCol = UserColumn(onTaskClick);
  const timelineCols = TimeLineColumns({
    config,
    slotWidthPx,
    updateTask,
    onTaskClick,
    onCellClick,
    startDate,
    daysToShow,
  });
  return [userCol, ...timelineCols];
}
