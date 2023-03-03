import { Axie } from "./Axie";
import Image from "next/image";
import Link from "next/link";
import type { AxieParts, FighterWithPartsAndItems } from "lib/validators";
import { Effect } from "./Effect";
import { CharmComponent } from "./Charm";
import { RuneComponent } from "./Rune";
interface OriginPlayerBattleDetails {
  team: [
    FighterWithPartsAndItems,
    FighterWithPartsAndItems,
    FighterWithPartsAndItems
  ];
  oldStars: number;
  newStars: number;
  won: boolean;
  draw?: boolean;
  userID?: string;
}

export function OriginPlayerBattleDetails({
  team,
  oldStars,
  newStars,
  won,
  draw,
  userID,
}: OriginPlayerBattleDetails) {
  return (
    <div className="relative flex w-[75%] flex-col items-center justify-around bg-[rgba(255,255,255,0.1)] sm:w-auto">
      {userID && (
        <Link
          href={`origins/profile/${userID}`}
          className="absolute top-1 right-1 z-10 h-5 w-5 transition-transform duration-100 hover:scale-125"
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
        {team.map(({ axie_id, axie_type, runes, charms, parts }) => {
          return (
            <li key={axie_id} className="relative mb-10 sm:mb-0">
              <div
                className={`absolute top-2 left-2 z-[1] flex sm:left-3 sm:top-3`}
              >
                <RuneComponent runes={runes} battleContext playerID={userID} />
              </div>
              <Axie
                key={axie_id}
                axieId={axie_id}
                axieType={axie_type}
                width={200}
                heigth={150}
              />
              <div
                className={`absolute bottom-2 left-1/2 z-[1] grid -translate-x-1/2 grid-cols-3 items-baseline sm:flex`}
              >
                {(Object.keys(charms) as (keyof AxieParts)[]).map(
                  (part, index) => {
                    return (
                      <CharmComponent
                        key={index}
                        charm={charms[part]}
                        axiePart={parts[part]}
                        playerID={userID}
                        battleContext
                      />
                    );
                  }
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <div
        className={`-mt-9 flex items-center justify-between ${
          draw ? "text-yellow-500" : won ? "text-green-500" : "text-red-400"
        }`}
      >
        <div className="flex items-center justify-center p-2">
          <p className="text-xs sm:text-base">{oldStars}</p>
          <span className="px-1 sm:px-3">→</span>
          <p className="text-sm font-bold sm:text-base">{newStars}</p>
        </div>
      </div>
      <Effect playerID={userID} battleContext />
    </div>
  );
}
