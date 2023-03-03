import { Axie } from "./Axie";
import OriginPlayerDetails from "./OriginPlayerDetails";
import TwitchDetails from "./TwitchDetails";
import { PROFILE_PLAYER_BATTLES } from "lib/consts";
import { RuneComponent } from "./Rune";
import type { AxieParts, Battle, User } from "lib/validators";
import CharmComponent from "./Charm";
import type { Rune } from "lib/runes";
import type { Charm } from "lib/charms";
import Effect from "./Effect";
import { getBattles, getCharms, getLeaderBoard, getRunes } from "lib/api";
import { createPlayer } from "lib/createPlayer";
import ArenaStarsChart from "components/ArenaStarsChart";

interface OriginProfileProps {
  userID: string;
}

interface getProfileDataProps {
  userID: string;
}

interface ProfileData {
  user?: User;
  battles: Battle[];
  runes: Rune[];
  charms: Charm[];
}

async function getProfileData({
  userID,
}: getProfileDataProps): Promise<ProfileData> {
  const [
    { _items: users },
    { battles: battles },
    { _items: charms },
    { _items: runes },
  ] = await Promise.all([
    getLeaderBoard({ userID, limit: 1 }),
    getBattles({ userID }),
    getCharms(),
    getRunes(),
  ]);

  return {
    user: users[0],
    battles,
    runes: runes.map((rune) => rune.item),
    charms: charms.map((charm) => charm.item),
  };
}
export async function OriginProfile({ userID }: OriginProfileProps) {
  const { user, battles, runes, charms } = await getProfileData({ userID });

  if (!user) {
    return (
      <p
        className={`mx-auto bg-[#2b1812eb] py-4 text-center font-semibold sm:w-[600px]`}
      >
        Missing player data 🫠
      </p>
    );
  }
  const player = createPlayer({
    battles,
    user,
    runes,
    charms,
  });

  return (
    <>
      <div className="relative flex flex-col">
        <div
          className={`mx-auto flex origin-bottom flex-col items-start justify-center rounded bg-[#2b1812eb] px-4 sm:w-[948px] sm:pb-8 sm:pt-4`}
        >
          <TwitchDetails
            live={Boolean(player?.channel?.live)}
            userId={player.userID}
          />
          <OriginPlayerDetails
            player={player}
            runes={runes}
            charms={charms}
            isProfile
          />
          <ul className="relative flex flex-1 items-center">
            {player.battles.length === 0 && (
              <div>
                <p className="w-full pl-4 pt-4 font-semibold">
                  Missing player battles data 🫠
                </p>
                <p className="w-full pl-4 text-[10px]">{`Last ${PROFILE_PLAYER_BATTLES} battles are not arena PVP battles.`}</p>
              </div>
            )}
            {player.team.map(
              ({ axie_id, axie_type, runes, charms, parts }, index) => {
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
                      className={`absolute top-0 left-2 z-[1] flex sm:left-3 sm:top-7 sm:translate-x-4 sm:scale-150`}
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
                      width={300}
                      heigth={225}
                    />
                    <div
                      className={`absolute -bottom-4 left-1/2 z-[1] grid -translate-x-1/2 grid-cols-3 items-baseline gap-x-6 gap-y-2 sm:bottom-2 sm:flex sm:scale-150 sm:gap-0`}
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
              }
            )}
          </ul>
        </div>
        <Effect isProfile playerID={player.userID} />
      </div>
      <ArenaStarsChart battles={player.battles} userID={userID} />
    </>
  );
}

OriginProfile.displayName = "Player";

export default OriginProfile;
