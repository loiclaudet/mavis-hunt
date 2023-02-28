import { AxieSkeleton } from "./AxieSkeleton";
import { PlayerDetailsSkeleton } from "./OriginPlayerDetailsSkeleton";

export default function OriginPlayerSkeleton() {
  return (
    <div className="relative flex w-[948px] max-w-full flex-col">
      <div
        className={`mb-1 flex min-h-[157px] flex-col items-start justify-center rounded bg-[#2b1812eb] pl-2 sm:pl-2 lg:flex-row lg:items-center`}
      >
        <PlayerDetailsSkeleton />

        <ul className="relative flex flex-1 items-center">
          {new Array(3).fill(null).map(
            // 3 fighters
            (_, index) => {
              return <AxieSkeleton key={index} width={200} heigth={100} />;
            }
          )}
        </ul>
      </div>
    </div>
  );
}
