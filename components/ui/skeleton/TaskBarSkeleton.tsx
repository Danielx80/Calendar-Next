import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TaskBarSkeletonProps {
  slotWidthPx: number;
  overlapCount?: number;
  overlapIndex?: number;
  rowHeightPx?: number;
  leftPx?: number;
}

export const TaskBarSkeleton: React.FC<TaskBarSkeletonProps> = ({
  slotWidthPx,
  overlapCount = 1,
  overlapIndex = 0,
  rowHeightPx = 64,
  leftPx = 0,
}) => {
  const GAP = 4;
  const totalGap = (overlapCount - 1) * GAP;
  const barHeight = (rowHeightPx - totalGap) / overlapCount;
  const topOffset = overlapIndex * (barHeight + GAP);

  const style: React.CSSProperties = {
    position: "absolute",
    width: slotWidthPx,
    height: barHeight,
    top: topOffset,
    left: leftPx,
  };

  return (
    <div style={style} className="overflow-hidden rounded-sm animate-pulse bg-gray-100">
      <div className="relative flex flex-col px-3 py-1 h-full space-y-1">
        {/* Placeholder de texto */}
        <Skeleton className="h-4 w-2/3" />
        {/* Placeholder de badge */}
        <div className="absolute top-1 right-3">
          <Skeleton className="h-3 w-5 rounded" />
        </div>
        {/* Placeholder de duración */}
        <Skeleton className="h-3 w-1/4" />
        {/* Placeholder de estado */}
        <div className="absolute bottom-1 right-2">
          <Skeleton className="h-3 w-1/6 rounded" />
        </div>
      </div>
    </div>
  );
};
