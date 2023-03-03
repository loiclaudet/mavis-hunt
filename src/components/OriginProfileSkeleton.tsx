import { PlayerDetailsSkeleton } from "./OriginPlayerDetailsSkeleton";
import { AxieSkeleton } from "./AxieSkeleton";
import { ArenaStarsChartSkeleton } from "./ArenaStarsChartSkeleton";

export function OriginProfileSkeleton() {
  return (
    <>
      <div className="relative flex flex-col">
        <div
          className={`mx-auto flex origin-bottom flex-col items-start justify-center rounded bg-[#2b1812eb] px-4 sm:w-[948px]`}
        >
          <PlayerDetailsSkeleton isProfile />
          <ul className="relative flex flex-1 origin-bottom-left items-center overflow-hidden sm:-translate-y-12 sm:scale-150">
            {new Array(3).fill(null).map(
              // 3 fighters
              (_, index) => {
                return <AxieSkeleton key={index} width={200} heigth={100} />;
              }
            )}
          </ul>
        </div>
      </div>
      <ArenaStarsChartSkeleton />
    </>
  );
}
