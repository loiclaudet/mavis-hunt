import { Axie } from "./Axie";
import OriginPlayerDetails from "./OriginPlayerDetails";
import { getRankEmoji } from "lib/rankEmoji";
import TwitchDetails from "./TwitchDetails";
import type { Player } from "lib/createPlayer";
import { MissingBattles } from "./MissingBattles";
interface OriginPlayerProps {
  player: Player;
  index?: number;
}
function OriginPlayer({ player, index }: OriginPlayerProps) {
  const { topRank } = player;
  const rankEmoji = getRankEmoji(topRank);

  if (!player) {
    return (
      <p className="w-full text-center font-semibold">Missing player data 🫠</p>
    );
  }
  return (
    <div className="relative flex w-full flex-col">
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
        <OriginPlayerDetails player={player} />
        {player.battles.length === 0 ? (
          <ul className="relative flex flex-1 items-center">
            <MissingBattles userID={player.userID} />
          </ul>
        ) : (
          <ul className="relative flex flex-1 items-center">
            {player.team.map(({ axie_id, axie_type }) => {
              return (
                <Axie
                  key={axie_id}
                  axieId={axie_id}
                  axieType={axie_type}
                  width={200}
                  heigth={150}
                />
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

OriginPlayer.displayName = "Player";

export default OriginPlayer;
