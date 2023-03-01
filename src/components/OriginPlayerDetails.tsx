import WinStreak from "components/WinStreak";
import type { Charm } from "lib/charms";
import type { Player } from "lib/createPlayer";
import type { Rune } from "lib/runes";
import Link from "next/link";
import BattlesButton from "./BattlesButton";

interface PlayerDetailsProps {
  player: Player;
  runes: Rune[];
  charms: Charm[];
  isProfile?: boolean;
}

export default function PlayerDetails({
  player,
  runes,
  charms,
  isProfile,
}: PlayerDetailsProps) {
  const { name, vstar, topRank, winStreak, winRate, userID } = player;
  return (
    <>
      <div
        className={`flex flex-col items-start py-2 pl-2 sm:pl-4 ${
          isProfile
            ? "mb-12 w-full sm:origin-top-left sm:scale-150"
            : "w-full max-w-[340px]"
        } `}
      >
        <div className="w-full">
          <Username name={name} userID={userID} isProfile={isProfile} />
          <div className="flex">
            <p className="mr-5">
              Rank:&nbsp;
              <b>{topRank > 1_000_000 ? "-" : topRank}</b>
            </p>
            <p className="mr-5">
              Stars:&nbsp;<b>{vstar}</b>
            </p>
            <p>
              Win rate:&nbsp;
              <b>{Math.round(100 * winRate)}%</b>
            </p>
          </div>
        </div>
        <div className="flex items-end">
          <BattlesButton player={player} runes={runes} charms={charms} />
          {winStreak >= 5 && <WinStreak streak={winStreak} />}
        </div>
      </div>
    </>
  );
}

interface UsernameProps {
  isProfile?: boolean;
  name: string;
  userID: string;
}
function Username({ isProfile, name, userID }: UsernameProps) {
  return (
    <h2 className="group truncate text-[20px]" title={name}>
      {isProfile ? (
        <span>{name}</span>
      ) : (
        <Link
          className="group-hover:underline"
          href={`origins/profile/${userID}`}
        >
          <span>{name}</span>
        </Link>
      )}
    </h2>
  );
}
