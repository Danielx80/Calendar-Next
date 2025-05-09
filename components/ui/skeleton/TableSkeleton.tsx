// src/components/ui/skeleton/TableSkeleton.tsx
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  cols = 6,
}) => {
  return (
    <>
      <thead>
        <tr className="animate-pulse">
          {Array.from({ length: cols }).map((_, i) => (
            <th key={i} className="p-2">
              <Skeleton className="h-6 w-24" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="animate-pulse">
        {Array.from({ length: rows }).map((_, r) => (
          <tr key={r}>
            {Array.from({ length: cols }).map((_, c) => (
              <td key={c} className="p-2">
                <Skeleton className="h-4 w-full" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </>
  );
};
