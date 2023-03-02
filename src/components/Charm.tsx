"use client";
import { getCards } from "data/cards";
import { useAtom } from "jotai";

import type { Charm } from "lib/charms";
import Image from "next/image";
import { useMemo } from "react";
import { cardAtom, itemAtom } from "./Effect";

interface CharmProps {
  charm: Charm | null;
  axiePart: string;
  battleContext?: boolean;
}
export default function CharmComponent({
  charm,
  battleContext,
  axiePart,
}: CharmProps) {
  const [, setItem] = useAtom(itemAtom);
  const [, setCard] = useAtom(cardAtom);
  const cards = useMemo(() => getCards(), []);
  const battleStyle = battleContext
    ? "h-[13px] max-h-[13px] w-[12px] max-w-[12px] rounded-[2px] sm:h-[12px] sm:max-h-[12px] sm:w-[10px] sm:max-w-[10px]"
    : "h-[17px] max-h-[17px] w-[15px] max-w-[15px] sm:max-h-[17px] sm:max-w-[15px]";

  return (
    <div
      onMouseEnter={() => {
        setItem(charm);
        const card =
          cards.find((card) => {
            return card.partId === axiePart;
          }) ?? null;
        setCard(card);
      }}
      onMouseLeave={() => {
        setItem(null);
        setCard(null);
      }}
      className={`relative mr-[2px] transition-transform sm:mr-1 sm:hover:scale-110 ${
        battleContext
          ? "mr-0 h-[28px] w-[20px] sm:mr-[1px] sm:h-[28px] sm:w-[20px]"
          : "h-[33px] w-[24px] sm:h-[33px] sm:w-[24px]"
      } ${
        !charm
          ? ` mx-[5px] rounded border-[1px] border-dashed border-white ${battleStyle}`
          : ""
      }`}
    >
      {charm && (
        <Image
          src={charm.imageUrl}
          alt="charm"
          loading="lazy"
          fill={true}
          unoptimized
          style={{
            objectFit: "contain",
            objectPosition: "bottom",
          }}
        />
      )}
    </div>
  );
}
