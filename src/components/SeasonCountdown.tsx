"use client";
import { useEffect, useMemo, useState } from "react";
import { DateTime, Duration } from "luxon";

interface PeriodComponentProps {
  endDate: number; // in milliseconds
}

export default function SeasonCountDown({ endDate }: PeriodComponentProps) {
  const [periodDuration, setPeriodDuration] = useState<number>(
    endDate - DateTime.now().toMillis()
  );
  const oneDay = useMemo(() => 1000 * 60 * 60 * 24, []);

  useEffect(() => {
    const endPeriodDiffFromNow = endDate - DateTime.now().toMillis();
    const interval = setInterval(() => {
      const endPeriodDiffFromNow = endDate - DateTime.now().toMillis();
      setPeriodDuration(endPeriodDiffFromNow);
    }, 60000); // refresh every minutes
    setPeriodDuration(endPeriodDiffFromNow);
    return () => clearInterval(interval);
  }, [endDate]);
  const isLastDay = periodDuration < oneDay;
  const day = isLastDay
    ? Duration.fromMillis(periodDuration).toFormat("h'h' mm'm'")
    : Duration.fromMillis(periodDuration).toFormat("d'd' h'h'");
  return (
    <span
      className={`text-xs font-semibold sm:text-base ${
        isLastDay ? "animate-pulse text-base text-red-400 sm:text-lg" : ""
      }`}
    >
      {`${day} left`}
    </span>
  );
}
