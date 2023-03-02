"use client";
import { atom, useAtom } from "jotai";
import { replaceBracesAndBracketsWithTags } from "lib/replaceBracesAndBracketsWithTags";
import type { Card, Item } from "lib/validators";
import Image from "next/image";
interface EffectProps {
  battleContext?: boolean;
  isProfile?: boolean;
}
export const itemAtom = atom<Item["item"] | null>(null);
export const cardAtom = atom<Card | null>(null);
export default function Effect({ battleContext, isProfile }: EffectProps) {
  const [item] = useAtom<Item["item"] | null>(itemAtom);
  const [card] = useAtom<Card | null>(cardAtom);

  if (!item) return null;

  return (
    <div
      className={`runeEffects pointer-events-none absolute left-1/2 z-30 flex w-80 max-w-full items-start rounded border-[1px] border-[#fff] bg-[#2b1812] px-3 py-2 text-base text-[#fff] ${
        battleContext
          ? "bottom-[55px] -translate-x-1/3 sm:bottom-[70px] sm:-translate-x-1/2"
          : "bottom-[40px] -translate-x-1/2 sm:bottom-[55px] sm:-translate-x-1/2"
      } ${isProfile ? "sm:scale-150" : ""}`}
    >
      {card && !battleContext && (
        <div className="relative mr-2 box-border h-20 w-20 shrink-0">
          <div
            className="relative h-full w-full overflow-hidden"
            style={{
              backgroundImage: `url(https://cdn.axieinfinity.com/game/origin-cards/base/origin-cards-20230222/${card.cardImage})`,
              backgroundPosition: "64% 30%",
              backgroundSize: "160% auto",
            }}
          ></div>
          <h4 className="absolute bottom-0 left-1/2 z-10 min-w-full -translate-x-1/2 bg-black/50 p-1 text-center text-sm">
            {card.cardName}
          </h4>
          <div className="absolute top-0 right-0 h-5 w-4 translate-x-[25px] sm:h-6 sm:w-5 sm:translate-x-[25px]">
            <Image
              src={item.imageUrl}
              alt={item.name}
              loading="lazy"
              fill={true}
              unoptimized
              style={{
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      )}
      <div>
        <p
          style={{
            fontWeight: 300,
            fontSize: "0.9rem",
          }}
          className={
            battleContext ? "" : card?.cardImage ? `indent-5 sm:indent-5` : ""
          }
          dangerouslySetInnerHTML={{
            __html: replaceBracesAndBracketsWithTags(item.description),
          }}
        ></p>
      </div>
    </div>
  );
}
