/* eslint-disable @next/next/no-img-element */
import { ArenaStarsChartLoader } from "./Loader";

export function ArenaStarsChartSkeleton() {
  return (
    <div
      className={`h=[550px] mx-auto flex max-h-[50%] w-[948px] max-w-full flex-col items-center justify-start rounded bg-[#2b1812eb] px-4`}
    >
      <span>
        <span className="font-semibold text-white sm:text-2xl">
          {`Arena Stars`}
        </span>
        <img
          src={`/vstar.png`}
          alt={"vstar"}
          width={16}
          height={16}
          style={{
            marginLeft: 4,
            marginBottom: 4,
            display: "inline-block",
          }}
        />
        <div className="text-sm font-[300] text-white">{`evolution on last XX battles`}</div>
      </span>
      <ArenaStarsChartLoader />
    </div>
  );
}
