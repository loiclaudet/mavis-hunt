import type { Rune } from "lib/runes";
import Image from "next/image";

interface RuneProps {
  battleContext?: boolean;
  runes: Rune[];
}
export function RuneComponent({ battleContext, runes }: RuneProps) {
  return (
    <>
      {runes.map((rune, index) => {
        return (
          <div
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
