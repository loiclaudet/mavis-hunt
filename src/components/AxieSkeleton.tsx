import Image from "next/image";

interface AxieProps {
  width: number;
  heigth: number;
  battleContext?: boolean;
}
export function AxieSkeleton({ width, heigth }: AxieProps) {
  return (
    <Image
      width={width}
      height={heigth * 0.58}
      src={`/placeholder.png`}
      alt={"axie"}
      unoptimized
    />
  );
}
