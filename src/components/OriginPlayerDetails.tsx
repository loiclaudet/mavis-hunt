"use client";
import Modal from "components/Modal";
import WinStreak from "components/WinStreak";
import type { Charm } from "lib/charms";
import type { Player } from "lib/getPlayer";
import type { Rune } from "lib/runes";
import Link from "next/link";
import { memo, useState } from "react";
import OriginBattles from "./OriginBattles";

interface PlayerDetailsProps {
  player: Player;
  runes?: Rune[];
  charms?: Charm[];
  isProfile?: boolean;
}

const PlayerDetails = memo(function PlayerDetailsComponent({
  player,
  runes,
  charms,
  isProfile,
}: PlayerDetailsProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { name, vstar, topRank, winStreak, winRate, userID } = player;
  const isBattlesButtonDisabled = player.battles.length === 0;
  return (
    <>
      <div
        className={`flex flex-col items-start py-2 pl-2 sm:pl-4 ${
          isProfile ? "w-full" : "max-w-80 w-80"
        } `}
      >
        <div>
          <Username name={name} userID={userID} isProfile={isProfile} />
          <div className="flex">
            <p className="mr-5">
              Rank:&nbsp;
              <b>{topRank}</b>
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
        <div className="flex items-baseline">
          <button
            disabled={isBattlesButtonDisabled}
            onClick={() => {
              setIsModalOpen(true);
            }}
            className={`mt-4 mr-3 w-28 ${
              isBattlesButtonDisabled
                ? "cursor-not-allowed opacity-50"
                : "transition-transform hover:scale-105"
            }`}
          >
            View Battles
          </button>
          {winStreak >= 5 && <WinStreak streak={winStreak} />}
        </div>
      </div>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)} buttonPosition="hidden">
          <OriginBattles
            player={player}
            runes={runes as Rune[]}
            charms={charms as Charm[]}
          />
        </Modal>
      )}
    </>
  );
});

interface UsernameProps {
  isProfile?: boolean;
  name: string;
  userID: string;
}
function Username({ isProfile, name, userID }: UsernameProps) {
  return (
    <h2 className="group text-[20px]" title={name}>
      {isProfile ? (
        <span>{name}</span>
      ) : (
        <Link className="group-hover:underline" href={`/profile/${userID}`}>
          <span>{name}</span>
        </Link>
      )}
    </h2>
  );
}
export default PlayerDetails;
