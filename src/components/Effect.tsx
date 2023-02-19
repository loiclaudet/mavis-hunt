"use client";
import { replaceBracesAndBracketsWithTags } from "lib/replaceBracesAndBracketsWithTags";
import Image from "next/image";
interface EffectProps {
  effect: string;
  battleContext?: boolean;
  axieCardName: string | null;
  axieCardImage: string | null;
  charmImage: string | null;
}
export default function Effect({
  effect,
  battleContext,
  axieCardName,
  axieCardImage,
  charmImage,
}: EffectProps) {
  return (
    <div
      className={`runeEffects pointer-events-none absolute left-1/2 z-30 flex w-80 max-w-full items-start rounded border-[1px] border-[#fff] bg-[#2b1812] px-3 py-2 text-base text-[#fff] ${
        battleContext
          ? "bottom-[55px] -translate-x-1/3 sm:bottom-[70px] sm:-translate-x-1/2"
          : "bottom-[40px] -translate-x-1/2 sm:bottom-[55px] sm:-translate-x-1/2"
      }`}
    >
      {axieCardName && axieCardImage && !battleContext && (
        <div className="relative mr-2 box-border h-20 w-20 shrink-0">
          <div className="relative h-full w-full">
            <Image
              className="rounded-[2px]"
              src={`/cards/${axieCardImage.replace(".png", "")}.jpeg`}
              alt={axieCardName}
              loading="lazy"
              fill={true}
              unoptimized
            />
          </div>
          <h4 className="absolute bottom-0 left-1/2 z-10 min-w-full -translate-x-1/2 bg-black/50 p-1 text-center text-sm">
            {axieCardName}
          </h4>
          {charmImage && (
            <div className="absolute top-0 right-0 h-5 w-4 translate-x-[25px] sm:h-6 sm:w-5 sm:translate-x-[25px]">
              <Image
                src={charmImage}
                alt={charmImage}
                loading="lazy"
                fill={true}
                unoptimized
                style={{
                  objectFit: "contain",
                }}
              />
            </div>
          )}
        </div>
      )}
      <div>
        <p
          style={{
            fontWeight: 300,
            fontSize: "0.9rem",
          }}
          className={
            battleContext ? "" : axieCardImage ? `indent-5 sm:indent-5` : ""
          }
          dangerouslySetInnerHTML={{
            __html: replaceBracesAndBracketsWithTags(effect),
          }}
        ></p>
      </div>
    </div>
  );
}
