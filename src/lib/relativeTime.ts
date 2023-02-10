import { DateTime, Duration } from "luxon";

export function relativeTime(
  timeInSeconds: number,
  format: "short" | "long" = "short"
): string {
  const isLong = format === "long";
  const battleDateTime = DateTime.fromSeconds(timeInSeconds);
  const now = DateTime.now();
  const diff = now.diff(battleDateTime).toMillis();
  const isLastDay = now.diff(battleDateTime, "days").days < 1;
  const isLast2Days = now.diff(battleDateTime, "days").days < 2;
  const isLastHour = now.diff(battleDateTime, "hours").hours < 1;
  const isLast2Hours = now.diff(battleDateTime, "hours").hours < 2;
  const relativeTime = isLastHour
    ? Duration.fromMillis(diff).toFormat(isLong ? "mm' min'" : "mm'm'")
    : isLastDay
    ? Duration.fromMillis(diff).toFormat(
        isLong ? `h' ${isLast2Hours ? "hour" : "hours"}'` : "h'h'"
      )
    : Duration.fromMillis(diff).toFormat(
        isLong ? `d' ${isLast2Days ? "day" : "days"}'` : "d'd'"
      );

  return relativeTime + " ago";
}
