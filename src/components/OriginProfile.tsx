"use client";
import { forwardRef, memo, useMemo, useState } from "react";
import { getCards } from "data/cards";
import type { PartType } from "agp-npm/dist/models/part";

import { Axie } from "./Axie";
import OriginPlayerDetails from "./OriginPlayerDetails";
import Effect from "./Effect";
import type { Rune } from "lib/runes";
import {
  getRuneDataFromRuneImageUrl,
  getRunesImagesFromRunesGameIds,
} from "lib/runes";
import type { Charm } from "lib/charms";
import { getCharmImagesFromCharmPartsAndCharmGameId } from "lib/charms";
import useWindowSize from "hooks/windowSize";
import TwitchDetails from "./TwitchDetails";
import { PROFILE_PLAYER_BATTLES } from "lib/consts";
import type { Player } from "lib/getPlayer";
interface OriginPlayerProps {
  player: Player;
  runes: Rune[];
  charms: Charm[];
}
const OriginProfile = memo(
  forwardRef<HTMLDivElement, OriginPlayerProps>(
    ({ player, runes, charms }, ref) => {
      const [effect, setEffect] = useState<string | null>(null);
      const [axieCardName, setAxieCardName] = useState<string | null>(null);
      const [axieCardImage, setAxieCardImage] = useState<string | null>(null);
      const [charmImage, setCharmImage] = useState<string | null>(null);
      const cards = useMemo(() => getCards(), []);
      const windowSize = useWindowSize();
      if (windowSize.height === undefined) {
        return null;
      }
      if (!player) {
        return (
          <p
            className={`mx-auto bg-[#2b1812eb] py-4 text-center font-semibold sm:w-[600px] ${
              windowSize.height < 1000 ? "sm:scale-[1.15]" : "sm:scale-[1.5]"
            }`}
          >
            Missing player data 🫠
          </p>
        );
      }
      return (
        <div ref={ref} key={player.userID} className="relative flex flex-col">
          <div
            className={`mx-auto flex origin-bottom flex-col items-start justify-center rounded bg-[#2b1812eb] p-4 sm:w-[632px] ${
              windowSize.height < 1000 ? "sm:scale-[1.15]" : "sm:scale-[1.5]"
            }`}
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
                (
                  {
                    axie_id,
                    axie_type,
                    runes: axieRunesIds,
                    charms: partsAndCharms,
                    parts,
                  },
                  index
                ) => {
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
                  const charmsImagesUrls =
                    getCharmImagesFromCharmPartsAndCharmGameId(
                      partsAndCharms,
                      charms
                    );
                  const runesImagesUrls = getRunesImagesFromRunesGameIds(
                    axieRunesIds,
                    runes
                  );
                  return (
                    <Axie
                      key={axie_id}
                      axieId={axie_id}
                      axieType={axie_type}
                      width={200}
                      heigth={150}
                      runesImagesUrls={runesImagesUrls}
                      charmsImagesUrls={charmsImagesUrls}
                      displayRuneEffect={(runeImageUrl: string | null) => {
                        setCharmImage(null);
                        setAxieCardName(null);
                        setAxieCardImage(null);
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
                      displayCharmDetails={({ charmImageUrl, charmIndex }) => {
                        if (charmImageUrl === null) {
                          setEffect(null);
                          setCharmImage(null);
                        } else {
                          const axiePartType = Object.keys(partsAndCharms)[
                            charmIndex
                          ] as PartType;
                          const card = cards.find((card) => {
                            return card.partId === parts[axiePartType];
                          });
                          const charm =
                            charms.find((charm) =>
                              charm.imageUrl.startsWith(charmImageUrl)
                            ) ?? null;
                          setEffect(charm?.description ?? null);
                          setCharmImage(charmImageUrl);
                          setAxieCardName(card?.cardName ?? null);
                          setAxieCardImage(card?.cardImage ?? null);
                        }
                      }}
                    />
                  );
                }
              )}
              {effect && (
                <Effect
                  effect={effect}
                  charmImage={charmImage}
                  axieCardImage={axieCardImage}
                  axieCardName={axieCardName}
                />
              )}
            </ul>
          </div>
        </div>
      );
    }
  )
);

OriginProfile.displayName = "Player";

export default OriginProfile;
