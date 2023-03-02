"use client";
import { useAtom } from "jotai";

import type { Rune } from "lib/runes";
import Image from "next/image";
import { cardAtom, itemAtom, userIDAtom } from "./Effect";

interface RuneProps {
  battleContext?: boolean;
  runes: Rune[];
  playerID?: string;
}
export function RuneComponent({ battleContext, runes, playerID }: RuneProps) {
  const [, setItem] = useAtom(itemAtom);
  const [, setCard] = useAtom(cardAtom);
  const [, setUserID] = useAtom(userIDAtom);
  return (
    <>
      {runes.map((rune, index) => {
        return (
          <div
            onMouseEnter={() => {
              if (!playerID) {
                return;
              }
              setUserID(playerID);
              setItem(rune);
              setCard(null);
            }}
            onMouseLeave={() => {
              setUserID(null);
              setItem(null);
              setCard(null);
            }}
            key={index}
            className={`relative mb-1 transition-transform hover:scale-125 ${
              battleContext ? "h-5 w-5 sm:h-7 sm:w-7" : "h-6 w-6 sm:h-8 sm:w-8"
            }`}
          >
            <Image
              src={rune.imageUrl}
              alt={"rune"}
              loading="lazy"
              fill={true}
              className={
                battleContext
                  ? "h-5 w-5 sm:h-7 sm:w-7"
                  : "h-6 w-6 sm:h-8 sm:w-8"
              }
              unoptimized
            />
          </div>
        );
      })}
    </>
  );
}
