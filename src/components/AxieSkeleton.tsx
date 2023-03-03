import Image from "next/image";
import { AxieLoader } from "./Loader";

interface AxieProps {
  width: number;
  heigth: number;
  battleContext?: boolean;
}
export function AxieSkeleton({ width, heigth }: AxieProps) {
  return (
    <>
      <AxieLoader />
      <Image
        width={width}
        height={heigth * 0.58}
        src={`/placeholder.png`}
        alt={"axie"}
        unoptimized
      />
    </>
  );
}
