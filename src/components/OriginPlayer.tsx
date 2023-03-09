import { Axie } from "./Axie";
import OriginPlayerDetails from "./OriginPlayerDetails";
import { getRankEmoji } from "lib/rankEmoji";
import TwitchDetails from "./TwitchDetails";
import type { Player } from "lib/createPlayer";
import { MissingBattles } from "./MissingBattles";
import { RuneComponent } from "./Rune";
import type { AxieParts } from "lib/validators";
import { CharmComponent } from "./Charm";
import type { Rune } from "lib/runes";
import type { Charm } from "lib/charms";
import { Effect } from "./Effect";
import { OnlineStatus } from "./OnlineStatus";
interface OriginPlayerProps {
  player: Player;
  index?: number;
  runes: Rune[];
  charms: Charm[];
}
function OriginPlayer({ player, runes, charms, index }: OriginPlayerProps) {
  const { topRank } = player;
  const rankEmoji = getRankEmoji(topRank);
  if (!player) {
    return (
      <p className="w-full text-center font-semibold">Missing player data 🫠</p>
    );
  }

  return (
    <div className="relative flex w-[948px] max-w-full flex-col">
      <OnlineStatus player={player} />
      {rankEmoji && (
        <div className="absolute right-0 top-0 z-10 select-none text-4xl">
          {rankEmoji}
        </div>
      )}
      <TwitchDetails
        leaderboardIndex={index}
        live={player?.channel?.live}
        userId={player.userID}
      />
      <div
        className={`mb-1 flex min-h-[157px] flex-col items-start justify-center rounded bg-[#2b1812eb] pl-2 sm:pl-2 lg:flex-row lg:items-center`}
      >
        <OriginPlayerDetails player={player} runes={runes} charms={charms} />
        {player.battles.length === 0 ? (
          <ul className="relative flex flex-1 items-center">
            <MissingBattles userID={player.userID} />
          </ul>
        ) : (
          <ul className="relative flex flex-1 items-center">
            {player.team.map(({ axie_id, axie_type, runes, charms, parts }) => {
              return (
                <li key={axie_id} className="relative mb-10 sm:mb-0">
                  <div
                    className={`absolute top-2 left-2 z-[1] flex sm:left-3 sm:top-7`}
                  >
                    <RuneComponent
                      runes={runes}
                      battleContext={false}
                      playerID={player.userID}
                    />
                  </div>
                  <Axie
                    key={axie_id}
                    axieId={axie_id}
                    axieType={axie_type}
                    width={200}
                    heigth={150}
                  />
                  <div
                    className={`absolute -bottom-4 left-1/2 z-[1] grid -translate-x-1/2 grid-cols-3 items-baseline gap-2 sm:bottom-2 sm:flex sm:gap-0`}
                  >
                    {(Object.keys(charms) as (keyof AxieParts)[]).map(
                      (part, index) => {
                        return (
                          <CharmComponent
                            key={index}
                            charm={charms[part]}
                            axiePart={parts[part]}
                            playerID={player.userID}
                          />
                        );
                      }
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <Effect playerID={player.userID} />
    </div>
  );
}

OriginPlayer.displayName = "Player";

export default OriginPlayer;
