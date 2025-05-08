'use client';
import { useCallback, useMemo } from "react";
import { getDayNumber } from "../../../helpers/dayUtils";
import { TaskDefinition, TaskManager, Timing, WorkDay, User } from "../../../types";

interface ResizeArgs {
  task: TaskDefinition;
  leftPx: number;
  widthPx: number;
  snapPx: number;
  pxToSlots: (px: number) => number;
  slotsToMin: (s: number) => number;
  setDims: React.Dispatch<{ leftPx: number; widthPx: number }>;
  onResize?: (id: string, timing: Timing) => void;
  managerConfig: TaskManager;
}

export function useTaskResize({
  task,
  leftPx: originLeft,
  widthPx: originWidth,
  snapPx,
  pxToSlots,
  slotsToMin,
  setDims,
  onResize,
  managerConfig,
}: ResizeArgs) {
  const [sH, sM] = managerConfig.start_time.split(":").map(Number);
  const [eH, eM] = managerConfig.end_time.split(":").map(Number);
  const startBound = sH * 60 + sM;
  const endBound = eH * 60 + eM;
  const minResize = 15;

  const origStart = task.start_at.getHours() * 60 + task.start_at.getMinutes();
  const origEnd = task.end_at.getHours() * 60 + task.end_at.getMinutes();

  const user = useMemo(() =>
    managerConfig.sections
      .flatMap((sec) => sec.users as User[])
      .find((u) => u.UUID === task.asigned_to),
    [managerConfig.sections, task.asigned_to]
  );

  const disabledMinRanges = useMemo(() => {
    const ranges: { start: number; end: number }[] = [];
    if (user) {
      const dayOfWeek = task.start_at.getDay();
      const wd = (user.work_days as WorkDay[]).find(
        (w) => getDayNumber(w.day) === dayOfWeek
      );
      if (wd) {
        const [sh, sm] = wd.start_time.split(":").map(Number);
        const [lh, lm] = (wd.lunch_time ?? "0:0").split(":").map(Number);
        const lunchDur = wd.lunch_duration ?? 0;
        const [eh, em] = wd.end_time.split(":").map(Number);

        ranges.push(
          { start: startBound, end: sh * 60 + sm },
          { start: lh * 60 + lm, end: lh * 60 + lm + lunchDur },
          { start: eh * 60 + em, end: endBound }
        );
      }
    }
    return ranges;
  }, [user, startBound, endBound, task.start_at]);

  const intersectsDisabled = useCallback(
    (newStart: number, newEnd: number) =>
      disabledMinRanges.some((r) => newStart < r.end && newEnd > r.start),
    [disabledMinRanges]
  );

  const toPx = useCallback(
    (newStart: number, newEnd: number) => {
      const deltaStart = newStart - origStart;
      const deltaLen = newEnd - newStart;
      const leftPx =
        originLeft +
        (deltaStart / minResize) * (snapPx * (minResize / slotsToMin(1)));
      const widthPx =
        (deltaLen / minResize) * (snapPx * (minResize / slotsToMin(1)));
      return { leftPx, widthPx };
    },
    [originLeft, origStart, minResize, snapPx, slotsToMin]
  );

  const onLeftDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const startX = e.clientX;
      const baseLeft = originLeft;
      let lastStart = origStart;

      const onMove = (ev: MouseEvent) => {
        const dx = ev.clientX - startX;
        const rawLp = Math.round((baseLeft + dx) / snapPx) * snapPx;
        const rawStart = origStart + slotsToMin(pxToSlots(rawLp - baseLeft));
        let clampedStart = Math.max(startBound, rawStart);
        clampedStart = Math.min(clampedStart, origEnd - minResize);
        if (intersectsDisabled(clampedStart, origEnd)) return;
        lastStart = clampedStart;

        const { leftPx, widthPx } = toPx(clampedStart, origEnd);
        setDims({ leftPx: Math.round(leftPx), widthPx: Math.round(widthPx) });
      };

      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        const sh = Math.floor(lastStart / 60);
        const sm = lastStart % 60;
        onResize?.(task.id, {
          startHour: sh,
          startMinute: sm,
          endHour: Math.floor(origEnd / 60),
          endMinute: origEnd % 60,
        });
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [
      originLeft,
      origStart,
      origEnd,
      startBound,
      minResize,
      snapPx,
      pxToSlots,
      slotsToMin,
      intersectsDisabled,
      toPx,
      setDims,
      onResize,
      task.id,
    ]
  );

  const onRightDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const startX = e.clientX;
      const baseWidth = originWidth;
      let lastEnd = origEnd;

      const onMove = (ev: MouseEvent) => {
        const dx = ev.clientX - startX;
        const rawW = Math.round((baseWidth + dx) / snapPx) * snapPx;
        const rawEnd = origStart + slotsToMin(pxToSlots(rawW));
        let clampedEnd = Math.min(endBound, rawEnd);
        clampedEnd = Math.max(clampedEnd, origStart + minResize);
        if (intersectsDisabled(origStart, clampedEnd)) return;
        lastEnd = clampedEnd;

        const { widthPx } = toPx(origStart, clampedEnd);
        setDims({ leftPx: originLeft, widthPx: Math.round(widthPx) });
      };

      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        const eh = Math.floor(lastEnd / 60);
        const em = lastEnd % 60;
        onResize?.(task.id, {
          startHour: Math.floor(origStart / 60),
          startMinute: origStart % 60,
          endHour: eh,
          endMinute: em,
        });
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [
      originLeft,
      originWidth,
      origStart,
      origEnd,
      endBound,
      minResize,
      snapPx,
      pxToSlots,
      slotsToMin,
      intersectsDisabled,
      toPx,
      setDims,
      onResize,
      task.id,
    ]
  );

  return { onLeftDown, onRightDown };
}
