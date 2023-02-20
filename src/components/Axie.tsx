import type { StarterId, StarterName } from "lib/starterAxies";
import { isStarterAxie, starterAxiesMap } from "lib/starterAxies";
import ImageWithFallback from "./ImageWithFallback";
import RuneComponent from "./Rune";
import CharmComponent from "./Charm";
import type { AxieType } from "lib/validators";

interface AxieProps {
  axieId: number;
  axieType: AxieType;
  axieRunesIds?: string[];
  charmsImagesUrls?: (string | null)[];
  runesImagesUrls?: (string | null)[];
  width: number;
  heigth: number;
  battleContext?: boolean;
  displayRuneEffect: (runeImageUrl: string | null) => void;
  displayCharmDetails: (args: DisplayCharmDetailsArgs) => void;
}
interface DisplayCharmDetailsArgs {
  charmIndex: number;
  charmImageUrl: string | null;
}
export function Axie({
  axieId,
  axieType,
  width,
  heigth,
  charmsImagesUrls = [],
  runesImagesUrls = [],
  battleContext,
  displayRuneEffect,
  displayCharmDetails,
}: AxieProps) {
  if (isStarterAxie(axieType)) {
    return (
      <li key={axieId} className="relative mb-10 sm:mb-0">
        <ImageWithFallback
          width={width}
          height={heigth * 0.58}
          src={`/starters/${
            starterAxiesMap.get(axieId as StarterId) as StarterName
          }.png`}
          fallbackSrc={`/placeholder.png`}
          priority
        />
        <div
          className={` absolute top-2 flex ${
            battleContext
              ? "left-3 top-1 sm:left-3 sm:top-2"
              : "left-2 sm:left-3 sm:top-7"
          }`}
        >
          {runesImagesUrls.map((runeImageUrl, index) => {
            return (
              <RuneComponent
                key={index}
                runeImageUrl={runeImageUrl}
                battleContext={battleContext}
                displayRuneEffect={displayRuneEffect}
              />
            );
          })}
        </div>
        <div
          className={`absolute left-1/2 flex -translate-x-1/2 flex-wrap items-end sm:w-auto sm:flex-nowrap ${
            battleContext
              ? "-bottom-[32px] w-[72px] sm:bottom-[11px]"
              : "-bottom-[32px] w-[78px] sm:bottom-[6px]"
          }`}
        >
          {charmsImagesUrls.map((charmImageUrl, index) => {
            return (
              <CharmComponent
                key={index}
                charmImageUrl={charmImageUrl}
                battleContext={battleContext}
                highLightCharm={(_charmImageUrl) =>
                  displayCharmDetails({
                    charmIndex: index,
                    charmImageUrl: _charmImageUrl,
                  })
                }
              />
            );
          })}
        </div>
      </li>
    );
  }
  return (
    <li key={axieId} className="relative mb-10 sm:mb-0">
      <a
        href={`https://app.axieinfinity.com/marketplace/axies/${axieId}/`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <ImageWithFallback
          width={width}
          height={heigth}
          src={`https://axiecdn.axieinfinity.com/axies/${axieId}/axie/axie-full-transparent.png`}
          fallbackSrc={`https://assets.axieinfinity.com/axies/${axieId}/axie/axie-full-transparent.png`}
          priority
        />
      </a>
      <div
        className={` absolute top-2 flex ${
          battleContext
            ? "left-3 top-1 sm:left-3 sm:top-2"
            : "left-2 sm:left-3 sm:top-7"
        }`}
      >
        {runesImagesUrls.map((runeImageUrl, index) => {
          return (
            <RuneComponent
              key={index}
              runeImageUrl={runeImageUrl}
              battleContext={battleContext}
              displayRuneEffect={displayRuneEffect}
            />
          );
        })}
      </div>
      <div
        className={`absolute left-1/2 flex -translate-x-1/2 flex-wrap items-end sm:w-auto sm:flex-nowrap ${
          battleContext
            ? "-bottom-[32px] w-[72px] sm:bottom-[11px]"
            : "-bottom-[32px] w-[78px] sm:bottom-[6px]"
        }`}
      >
        {charmsImagesUrls.map((charmImageUrl, index) => {
          return (
            <CharmComponent
              key={index}
              charmImageUrl={charmImageUrl}
              battleContext={battleContext}
              highLightCharm={(_charmImageUrl) =>
                displayCharmDetails({
                  charmIndex: index,
                  charmImageUrl: _charmImageUrl,
                })
              }
            />
          );
        })}
      </div>
    </li>
  );
}
