import { memo, useState } from "react";
import { Axie } from "./Axie";
import Effect from "./Effect";
import type { Charm } from "lib/charms";
import {
  getCharmDataFromCharmImageUrl,
  getCharmImagesFromCharmPartsAndCharmGameId,
} from "lib/charms";
import type { Rune } from "lib/runes";
import {
  getRuneDataFromRuneImageUrl,
  getRunesImagesFromRunesGameIds,
} from "lib/runes";
import Image from "next/image";
import Link from "next/link";
import { relativeTime } from "lib/relativeTime";
import type { Fighters } from "lib/validators";
import type { Player } from "lib/getPlayer";

interface OriginBattlesProps {
  player: Player;
  runes: Rune[];
  charms: Charm[];
}

const Battles = memo(function BattlesComponent({
  player,
  runes,
  charms,
}: OriginBattlesProps) {
  if (!player) {
    return (
      <p className="w-full text-center font-semibold">
        Missing player battles data 🫠
      </p>
    );
  }
  const { battles, userID } = player;

  return (
    <div className="w-[960px] max-w-full animate-openModal overflow-auto bg-[rgba(43,24,18,1)] opacity-0">
      <ul>
        {battles.map(
          ({
            battle_uuid,
            client_ids,
            first_client_fighters,
            second_client_fighters,
            winner,
            rewards,
            created_at,
          }) => {
            const isFirstTeam = client_ids[0] === player.userID;
            const won = isFirstTeam ? winner === 0 : winner === 1;
            const firstTeamDetails = {
              team: first_client_fighters,
              oldStars: rewards?.[0]?.old_vstar ?? 0,
              newStars: rewards?.[0]?.new_vstar ?? 0,
            };
            const secondTeamDetails = {
              team: second_client_fighters,
              oldStars: rewards?.[1]?.old_vstar ?? 0,
              newStars: rewards?.[1]?.new_vstar ?? 0,
            };

            return (
              <li
                key={battle_uuid}
                className={`relative mb-1 flex flex-col items-start justify-center last:mb-0 sm:static sm:flex-row sm:items-stretch`}
              >
                <PlayerBattleDetails
                  {...(isFirstTeam ? firstTeamDetails : secondTeamDetails)}
                  won={won}
                  runes={runes}
                  charms={charms}
                />
                <div className="absolute top-0 right-0 flex h-full w-[25%] flex-grow flex-col items-center justify-center bg-[rgba(255,255,255,0.1)] sm:static sm:h-auto sm:w-auto">
                  <div className="mb-2 flex items-center">
                    <Image
                      width={12}
                      height={12}
                      src={`/clock.svg`}
                      alt="clock"
                      loading="lazy"
                      unoptimized
                    />
                    <span className="ml-1 shrink-0 text-sm font-semibold">
                      {relativeTime(created_at)}
                    </span>
                  </div>
                  <p
                    className={`mb-2 flex items-baseline text-sm font-bold tabular-nums ${
                      won ? "text-green-500" : "text-red-400"
                    }`}
                  >
                    {`${won ? "⬆" : "⬇"} ${Math.abs(
                      isFirstTeam
                        ? firstTeamDetails.oldStars - firstTeamDetails.newStars
                        : secondTeamDetails.oldStars -
                            secondTeamDetails.newStars
                    )}`}
                    <span className="text-xs sm:text-sm">&nbsp;★</span>
                  </p>
                  <a
                    href={`https://storage.googleapis.com/origin-production/origin.html?f=rpl&q=${battle_uuid}&userId=${userID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="bg-[length:100%_100%] transition-transform hover:scale-105">
                      Watch
                    </button>
                  </a>
                </div>
                <PlayerBattleDetails
                  {...(isFirstTeam ? secondTeamDetails : firstTeamDetails)}
                  won={!won}
                  runes={runes}
                  charms={charms}
                  userID={isFirstTeam ? client_ids[1] : client_ids[0]}
                />
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
});

interface OriginBattleDetails {
  team: Fighters;
  oldStars: number;
  newStars: number;
  won: boolean;
  charms: Charm[];
  runes: Rune[];
  userID?: string;
}

const PlayerBattleDetails = memo(function PlayerBattleDetails({
  team,
  oldStars,
  newStars,
  won,
  charms,
  runes,
  userID,
}: OriginBattleDetails) {
  const [effect, setEffect] = useState<string | null>(null);

  return (
    <div className="relative flex w-[75%] flex-col items-center justify-around bg-[rgba(255,255,255,0.1)] sm:w-auto">
      {userID && (
        <Link
          href={`/profile/${userID}`}
          className="absolute top-1 right-1 z-10 h-5 w-5 transition-transform duration-100 hover:scale-125"
          target="_blank"
          rel="noopener noreferrer"
          title="Visit profile"
        >
          <Image
            src={`/profile.svg`}
            fill={true}
            alt="profile"
            unoptimized
            style={{
              objectFit: "contain",
            }}
          />
        </Link>
      )}
      <ul className={`mb-5 flex items-center justify-between`}>
        {team.map(
          ({ axie_id, axie_type, runes: runesIds, charms: partsAndCharms }) => {
            const charmsImagesUrls = getCharmImagesFromCharmPartsAndCharmGameId(
              partsAndCharms,
              charms
            );
            const runesImagesUrls = getRunesImagesFromRunesGameIds(
              runesIds,
              runes
            );
            return (
              <Axie
                key={axie_id}
                axieId={axie_id}
                axieType={axie_type}
                axieRunesIds={runesIds}
                charmsImagesUrls={charmsImagesUrls}
                runesImagesUrls={runesImagesUrls}
                width={150}
                heigth={112.5}
                battleContext
                displayRuneEffect={(runeImageUrl: string | null) => {
                  if (runeImageUrl === null) {
                    setEffect(null);
                  } else {
                    const rune = getRuneDataFromRuneImageUrl(
                      runeImageUrl,
                      runes
                    );
                    setEffect(rune?.description ?? null);
                  }
                }}
                displayCharmDetails={({ charmImageUrl }) => {
                  if (charmImageUrl === null) {
                    setEffect(null);
                  } else {
                    const charm = getCharmDataFromCharmImageUrl(
                      charmImageUrl,
                      charms
                    );
                    setEffect(charm?.description ?? null);
                  }
                }}
              />
            );
          }
        )}
      </ul>
      <div
        className={`-mt-9 flex items-center justify-between ${
          won ? "text-green-500" : "text-red-400"
        }`}
      >
        <div className="flex items-center justify-center p-2">
          <p className="text-xs sm:text-base">{oldStars}</p>
          <span className="px-1 sm:px-3">→</span>
          <p className="text-sm font-bold sm:text-base">{newStars}</p>
        </div>
      </div>
      {effect && (
        <Effect
          battleContext
          effect={effect}
          axieCardImage={null}
          axieCardName={null}
          charmImage={null}
        />
      )}
    </div>
  );
});
export default Battles;
