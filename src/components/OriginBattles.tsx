import Image from "next/image";
import { relativeTime } from "lib/relativeTime";
import type { FighterWithPartsAndItems } from "lib/validators";
import type { Player } from "lib/createPlayer";
import { setPartsAndItems } from "lib/createPlayer";
import type { Rune } from "lib/runes";
import type { Charm } from "lib/charms";
import { LEADERBOARD_PLAYER_BATTLES } from "lib/consts";
import { OriginPlayerBattleDetails } from "./OriginPlayerBattleDetails";

interface OriginBattlesProps {
  player: Player;
  runes: Rune[];
  charms: Charm[];
}

export default function Battles({ player, runes, charms }: OriginBattlesProps) {
  if (!player) {
    return (
      <p className="w-full text-center font-semibold">
        Missing player battles data 🫠
      </p>
    );
  }
  const { battles, userID } = player;
  const displayedBattles = battles.slice(
    0,
    Math.min(battles.length, LEADERBOARD_PLAYER_BATTLES)
  );

  return (
    <div className="w-[960px] max-w-full animate-openModal overflow-auto bg-[rgba(43,24,18,1)] opacity-0">
      <ul>
        {displayedBattles.map(
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
            const draw = winner === 2;
            const firstTeamDetails = {
              team: first_client_fighters.map((fighter) => {
                return setPartsAndItems({ fighter, runes, charms });
              }) as [
                FighterWithPartsAndItems,
                FighterWithPartsAndItems,
                FighterWithPartsAndItems
              ],
              oldStars: rewards?.[0]?.old_vstar ?? 0,
              newStars: rewards?.[0]?.new_vstar ?? 0,
              userID: client_ids[0],
            };
            const secondTeamDetails = {
              team: second_client_fighters.map((fighter) => {
                return setPartsAndItems({ fighter, runes, charms });
              }) as [
                FighterWithPartsAndItems,
                FighterWithPartsAndItems,
                FighterWithPartsAndItems
              ],
              oldStars: rewards?.[1]?.old_vstar ?? 0,
              newStars: rewards?.[1]?.new_vstar ?? 0,
              userID: client_ids[1],
            };

            return (
              <li
                key={battle_uuid}
                className={`relative mb-1 flex flex-col items-start justify-center last:mb-0 sm:static sm:flex-row sm:items-stretch`}
              >
                <OriginPlayerBattleDetails
                  {...(isFirstTeam ? firstTeamDetails : secondTeamDetails)}
                  won={won}
                  draw={draw}
                  userID={undefined}
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
                      draw
                        ? "text-yellow-500"
                        : won
                        ? "text-green-500"
                        : "text-red-400"
                    }`}
                  >
                    {draw
                      ? "draw"
                      : `${won ? "⬆" : "⬇"} ${Math.abs(
                          isFirstTeam
                            ? firstTeamDetails.oldStars -
                                firstTeamDetails.newStars
                            : secondTeamDetails.oldStars -
                                secondTeamDetails.newStars
                        )}`}
                    {!draw && (
                      <span className="text-xs sm:text-sm">&nbsp;★</span>
                    )}
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
                <OriginPlayerBattleDetails
                  {...(isFirstTeam ? secondTeamDetails : firstTeamDetails)}
                  won={!won}
                  draw={draw}
                />
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
}
