"use client"
import React, { useState, useEffect } from "react";

interface Props {
  startHour: number;
  endHour: number;
  hourWidth: number;
  daysToShow: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  xOffset?: number;
  color?: string;
}

export const CurrentTimeIndicator: React.FC<Props> = ({
  startHour,
  endHour,
  hourWidth,
  daysToShow,
  containerRef,
  xOffset = 0,
  color = "#8e44ad",
}) => {
  const totalHours = endHour - startHour + 1;
  const [timeLabel, setTimeLabel] = useState<string>("");
  const [positions, setPositions] = useState<number[]>([]);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      // Minutos desde medianoche
      const baseLocal = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const diffH = (now.getTime() - baseLocal.getTime()) / 3600000 - startHour;
      const clamped = Math.max(0, Math.min(diffH, totalHours));

      // Actualizar etiqueta
      const h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, "0");
      const suffix = h >= 12 ? "pm" : "am";
      const h12 = h % 12 === 0 ? 12 : h % 12;
      setTimeLabel(`${h12}:${m}${suffix}`);

      const scrollLeft = containerRef.current?.scrollLeft ?? 0;

      const ps = Array.from({ length: daysToShow }, (_, i) => {
        const absX = (i * totalHours + clamped) * hourWidth;
        return absX - scrollLeft + xOffset;
      });
      setPositions(ps);
    };

    update();
    const iv = window.setInterval(update, 60000);
    return () => window.clearInterval(iv);
  }, [startHour, endHour, hourWidth, daysToShow, xOffset, containerRef, totalHours]);

  if (!positions.length) return null;

  return (
    <>
      {positions.map((x, idx) => (
        <React.Fragment key={idx}>
          <div
            style={{
              position: "absolute",
              left: x,
              top: 0,
              height: "100%",
              width: 1,
              backgroundColor: color,
              pointerEvents: "none",
              zIndex: 20,
            }}
          />
          {idx === 0 && (
            <div
              style={{
                position: "absolute",
                left: x + 4,
                top: 40,
                padding: "2px 4px",
                borderRadius: 4,
                fontSize: "0.75rem",
                fontWeight: "bold",
                color,
                whiteSpace: "nowrap",
                pointerEvents: "none",
                zIndex: 20,
              }}
            >
              {timeLabel}
            </div>
          )}
        </React.Fragment>
      ))}
    </>
  );
};