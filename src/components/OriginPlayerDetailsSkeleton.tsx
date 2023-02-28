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
          isProfile ? "w-full" : "w-full max-w-[340px]"
        } `}
      >
        <PlayerDetailsLoader />
      </div>
    </>
  );
}
