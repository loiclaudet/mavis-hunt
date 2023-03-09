import { SeasonLoader } from "./Loader";

export function SeasonSkeleton() {
  return (
    <div className="mt-2 flex h-[56px] w-[480px] max-w-full justify-around sm:mt-auto sm:h-[80px] sm:w-auto">
      <SeasonLoader />
    </div>
  );
}
