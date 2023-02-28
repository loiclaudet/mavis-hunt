import { Axie } from "./Axie";
import OriginPlayerDetails from "./OriginPlayerDetails";
import TwitchDetails from "./TwitchDetails";
import { PROFILE_PLAYER_BATTLES } from "lib/consts";
import type { Player } from "lib/createPlayer";
import { RuneComponent } from "./Rune";
interface OriginPlayerProps {
  player: Player;
}
export function OriginProfile({ player }: OriginPlayerProps) {
  if (!player) {
    return (
      <p
        className={`mx-auto bg-[#2b1812eb] py-4 text-center font-semibold sm:w-[600px]`}
      >
        Missing player data 🫠
      </p>
    );
  }
  return (
    <div className="relative flex flex-col">
      <div
        className={`$ mx-auto flex origin-bottom flex-col items-start justify-center rounded bg-[#2b1812eb] p-4 sm:w-[948px]`}
      >
        <TwitchDetails
          live={Boolean(player?.channel?.live)}
          userId={player.userID}
        />
        <OriginPlayerDetails player={player} isProfile />
        <ul className="relative flex flex-1 items-center">
          {player.battles.length === 0 && (
            <div>
              <p className="w-full pl-4 pt-4 font-semibold">
                Missing player battles data 🫠
              </p>
              <p className="w-full pl-4 text-[10px]">{`Last ${PROFILE_PLAYER_BATTLES} battles are not arena PVP battles.`}</p>
            </div>
          )}
          {player.team.map(({ axie_id, axie_type, runes }, index) => {
            if (player.battles.length === 0) {
              return (
                <div key={index}>
                  <p className="w-full pl-4 pt-4 font-semibold">
                    Missing player battles data 🫠
                  </p>
                  <p className="w-full pl-4 text-xs">{`Last ${PROFILE_PLAYER_BATTLES} battles are not arena PVP battles.`}</p>
                </div>
              );
            }
            return (
              <li key={axie_id} className="relative mb-10 sm:mb-0">
                <div
                  className={`absolute top-2 left-2 z-[1] flex translate-x-4 scale-150 sm:left-3 sm:top-7`}
                >
                  <RuneComponent runes={runes} battleContext={false} />
                </div>
                <Axie
                  key={axie_id}
                  axieId={axie_id}
                  axieType={axie_type}
                  width={300}
                  heigth={225}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

OriginProfile.displayName = "Player";

export default OriginProfile;
