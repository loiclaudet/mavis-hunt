import { PlayerDetailsLoader } from "./Loader";

interface PlayerDetailsSkeletonProps {
  isProfile?: boolean;
}

export function PlayerDetailsSkeleton({
  isProfile,
}: PlayerDetailsSkeletonProps) {
  return (
    <>
      <div
        className={`py-2 pl-2 sm:pl-4 ${
          isProfile ? "w-full origin-top-left scale-50" : "w-full max-w-[340px]"
        } `}
      >
        <PlayerDetailsLoader />
      </div>
    </>
  );
}
