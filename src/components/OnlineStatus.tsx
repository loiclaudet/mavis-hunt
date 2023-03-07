import { DateTime } from "luxon";
import type { CSSProperties } from "react";
import type { Player } from "lib/createPlayer";

export function OnlineStatus({
  player,
  customStyle,
}: {
  player: Player;
  customStyle?: CSSProperties;
}) {
  const lastBattle = player.battles.at(0);
  const battleDateTime = DateTime.fromSeconds(
    lastBattle?.created_at ?? 0
  ).toMillis();

  const fiveminutes = DateTime.now().minus({ minutes: 5 }).toMillis();
  const isOnline = battleDateTime > fiveminutes;

  if (!isOnline) return null;

  return (
    <div
      title="high chances to be online"
      className="absolute left-[7px] top-[37px] h-[8px] w-[8px] translate-y-1/2 animate-pulse rounded-full bg-green-500"
      style={customStyle ? customStyle : {}}
    ></div>
  );
}
