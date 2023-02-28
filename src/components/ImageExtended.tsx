import Image from "next/image";

interface ImageExtendedProps {
  src: string;
  priority?: boolean;
  [key: string]: unknown;
}
export default function ImageExtended({
  src,
  priority,
  ...rest
}: ImageExtendedProps) {
  return (
    <Image
      style={{ objectFit: "contain" }}
      {...rest}
      src={src}
      alt={"axie"}
      className="overflow-hidden whitespace-nowrap indent-[100%] transition-transform hover:scale-105"
      unoptimized
      {...(priority ? {} : { loading: "lazy" })}
      priority={priority}
    />
  );
}
