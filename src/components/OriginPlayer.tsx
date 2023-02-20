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
import { LEADERBOARD_PLAYER_BATTLES, PROFILE_PLAYER_BATTLES } from "lib/consts";
import Link from "next/link";
import { getRankEmoji } from "lib/rankEmoji";
import TwitchDetails from "./TwitchDetails";
import type { Player } from "lib/createPlayer";
interface OriginPlayerProps {
  player: Player;
  runes: Rune[];
  charms: Charm[];
  index?: number;
}
const OriginPlayer = memo(
  forwardRef<HTMLDivElement, OriginPlayerProps>(
    ({ player, runes, charms, index }, ref) => {
      const { topRank } = player;
      const rankEmoji = getRankEmoji(topRank);
      const [effect, setEffect] = useState<string | null>(null);
      const [axieCardName, setAxieCardName] = useState<string | null>(null);
      const [axieCardImage, setAxieCardImage] = useState<string | null>(null);
      const [charmImage, setCharmImage] = useState<string | null>(null);
      const cards = useMemo(() => getCards(), []);

      if (!player) {
        return (
          <p className="w-full text-center font-semibold">
            Missing player data 🫠
          </p>
        );
      }
      return (
        <div ref={ref} key={player.userID} className="relative flex flex-col">
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
            className={`mb-1 flex min-h-[157px] flex-col items-start justify-center rounded bg-[#2b1812eb] pl-2 sm:flex-row sm:items-center sm:pl-2`}
          >
            <OriginPlayerDetails
              player={player}
              runes={runes}
              charms={charms}
            />
            {player.battles.length === 0 ? (
              <ul className="relative flex flex-1 items-center">
                <MissingBattles userID={player.userID} />
              </ul>
            ) : (
              <ul className="relative flex flex-1 items-center">
                {player.team.map(
                  ({
                    axie_id,
                    axie_type,
                    runes: axieRunesIds,
                    charms: partsAndCharms,
                    parts,
                  }) => {
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
                        displayCharmDetails={({
                          charmImageUrl,
                          charmIndex,
                        }) => {
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
            )}
          </div>
        </div>
      );
    }
  )
);

interface MissingBattlesProps {
  userID: string;
}

function MissingBattles({ userID }: MissingBattlesProps) {
  const [displayDetails, setDisplayDetails] = useState<boolean>(false);
  return (
    <>
      {displayDetails ? (
        <div>
          <p className="mb-2 w-full text-lg font-semibold">
            {`Last ${LEADERBOARD_PLAYER_BATTLES} battles are not PVP arena battles.`}
          </p>
          <div>
            <span>{`Look at player's `}</span>
            <Link
              href={`/origins/profile/${userID}`}
              className="text-blue-500 underline"
            >
              profile page
            </Link>
            <span>{` based on last ${PROFILE_PLAYER_BATTLES} battles to get a chance to see its last arena team.`}</span>
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center justify-center">
          <button
            onClick={() => setDisplayDetails(true)}
            className="rounded-1 mr-2 flex h-4 w-2 items-center justify-center text-white transition-transform hover:scale-105"
          >
            <span className="font-bold">i</span>
          </button>
          <p className="font-semibold">Missing player battles data 🫠</p>
        </div>
      )}
    </>
  );
}

OriginPlayer.displayName = "Player";

export default OriginPlayer;
