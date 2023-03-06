import { LEADERBOARD_LIMIT, PAGINATION_COUNT } from "lib/consts";
import Link from "next/link";
import { Suspense } from "react";
import { Season } from "./Season";
export type SortOption = "rank" | "winstreak" | "winrate";

export function Header({ pageID }: { pageID: number }) {
  return (
    <header
      className={`sticky top-0 z-20 mx-auto mb-1 box-border w-[948px] max-w-full bg-[#2b1812eb] pt-1 pb-2 text-center transition-transform sm:p-3`}
    >
      <Suspense fallback={<div>loading...</div>}>
        {/* @ts-expect-error Server Component*/}
        <Season />
      </Suspense>
      <div className="mx-auto mt-3 flex w-full max-w-[360px] items-center justify-center gap-x-2">
        {new Array(PAGINATION_COUNT).fill(null).map((_, i) => {
          const isActivePage = pageID === i + 1;
          return (
            <Link
              href={`origins/leaderboard/${i + 1}`}
              key={i}
              prefetch={false}
            >
              <button
                className={`mr-2 flex max-w-[4.8rem] basis-1/4 justify-center py-1 px-2 last:mr-0 ${
                  isActivePage
                    ? "cursor-default brightness-[0.65] contrast-[1.52] hue-rotate-[10deg] saturate-[.5]"
                    : "transition-transform hover:scale-110"
                }`}
              >
                {`${(i + 1) * LEADERBOARD_LIMIT}`}
              </button>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
