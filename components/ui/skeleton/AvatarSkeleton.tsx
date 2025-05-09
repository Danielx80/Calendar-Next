import React from "react";
import { Skeleton } from "../skeleton";

export const AvatarSkeleton = () => {
  return (
    <div className="flex justify-center gap-1 ">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="grid items-center mb-2 mt-2">
        <Skeleton className="h-2 w-26" />
        <Skeleton className="h-2 w-22" />
      </div>
    </div>
  );
};
