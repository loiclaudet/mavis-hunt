import OriginPlayerSkeleton from "./OriginPlayerSkeleton";

export interface PlayerListSkeletonProps {
  playersQuantity: number;
}
export function PlayerListSkeleton({
  playersQuantity,
}: PlayerListSkeletonProps) {
  return (
    <>
      {new Array(playersQuantity).fill(null).map((_, index) => {
        return <OriginPlayerSkeleton key={index} />;
      })}
    </>
  );
}
