"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { DateTime, Duration } from "luxon";
import { SEASON_DURATION } from "lib/consts";
import { MilliAXSButton } from "./MilliAXSButton";

interface PeriodComponentProps {
  endDate: number; // in milliseconds
}

export default function SeasonCountDown({ endDate }: PeriodComponentProps) {
  const [periodDuration, setPeriodDuration] = useState<number>(
    getEraPeriodDuration(endDate)
  );
  const oneDay = useMemo(() => 1000 * 60 * 60 * 24, []);
  const era = useMemo(() => getEra(endDate), [endDate]);
  const intervalRef = useRef<NodeJS.Timer>();

  useEffect(() => {
    const eraPeriodDuration = getEraPeriodDuration(endDate);

    intervalRef.current = setInterval(() => {
      const eraPeriodDuration = getEraPeriodDuration(endDate);
      setPeriodDuration(eraPeriodDuration);
    }, 60000); // refresh every minutes

    setPeriodDuration(eraPeriodDuration);

    return () => clearInterval(intervalRef.current);
  }, [era, endDate]);

  const isLastDay = periodDuration <= oneDay;
  const day = isLastDay
    ? Duration.fromMillis(periodDuration)
        .toFormat("h'h' mm'm'")
        .padStart(1, "0")
    : Duration.fromMillis(periodDuration).toFormat("d'd' h'h'");
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Era era={era} />
      <div className="flex">
        <MilliAXSButton />
        <span
          className={`text-xs font-semibold sm:text-base ${
            isLastDay ? "animate-pulse text-base text-red-400 sm:text-lg" : ""
          }`}
        >
          {`${day} left`}
        </span>
      </div>
    </div>
  );
}

type Era = "rare" | "epic" | "mystic";
function Era({ era }: { era: Era }) {
  return (
    <div
      className={`rounded px-1 text-sm font-black capitalize sm:p-[2px] sm:px-2 sm:text-base ${
        era === "rare"
          ? "bg-era-rare"
          : era === "epic"
          ? "bg-era-epic"
          : "bg-era-mystic"
      }`}
    >{`${era} Era`}</div>
  );
}
function getEra(endDate: number): Era {
  const oneDay = 1000 * 60 * 60 * 24;
  const sevenDays = oneDay * 7;
  const twentyOneDays = oneDay * 21;
  const now = DateTime.now().toMillis();
  const periodDuration = SEASON_DURATION - (endDate - now);
  if (periodDuration < sevenDays) {
    return "rare";
  }
  if (periodDuration < twentyOneDays) {
    return "epic";
  }
  return "mystic";
}

function getEraPeriodDuration(endDate: number): number {
  const oneDay = 1000 * 60 * 60 * 24;
  const sevenDays = oneDay * 7;
  const twentyOneDays = oneDay * 21;
  const now = DateTime.now().toMillis();
  const periodDuration = SEASON_DURATION - (endDate - now);
  if (periodDuration < sevenDays) {
    return sevenDays - periodDuration;
  }
  if (periodDuration < twentyOneDays) {
    return twentyOneDays - periodDuration;
  }
  return SEASON_DURATION - periodDuration;
}
