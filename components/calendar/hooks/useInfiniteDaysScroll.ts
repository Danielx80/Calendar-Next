import { useEffect } from "react";

interface UseInfiniteDaysScrollParams {
  containerRef: React.RefObject<HTMLElement>;
  baseDate: Date;
  startHour: number; // e.g. sH (integer hour) from config
  endHour: number; // e.g. eH (integer hour) from config
  slotWidth: number; // width in px of one hour column
  loadingMore: boolean;
  setLoadingMore: React.Dispatch<React.SetStateAction<boolean>>;
  setDaysToShow: React.Dispatch<React.SetStateAction<number>>;
  setDisplayedDate: React.Dispatch<React.SetStateAction<Date>>;
}
export function useInfiniteDaysScroll({
  containerRef,
  baseDate,
  startHour,
  endHour,
  slotWidth,
  loadingMore,
  setLoadingMore,
  setDaysToShow,
  setDisplayedDate,
}: UseInfiniteDaysScrollParams) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let timer: NodeJS.Timeout;

    // Cada "día" tiene tantos píxeles de ancho como horas * slotWidth
    const totalHours = endHour - startHour + 1;
    const dayWidth = totalHours * slotWidth;

    const onScroll = () => {
      // Si llegamos casi al final, cargamos un día más
      if (
        !loadingMore &&
        el.scrollLeft + el.clientWidth >= el.scrollWidth - 100
      ) {
        setLoadingMore(true);
        timer = setTimeout(() => {
          setDaysToShow((n) => n + 1);
          setLoadingMore(false);
        }, 800);
      }

      // Calculamos qué día se está viendo en función del scroll
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
  }, [
    containerRef,
    baseDate,
    startHour,
    endHour,
    slotWidth,
    loadingMore,
    setLoadingMore,
    setDaysToShow,
    setDisplayedDate,
  ]);
}
