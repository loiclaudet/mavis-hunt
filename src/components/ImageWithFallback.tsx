import Image from "next/image";
import { useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  fallbackSrc: string;
  priority?: boolean;
  [key: string]: unknown;
}
export default function ImageWithFallback({
  src,
  fallbackSrc,
  priority,
  ...rest
}: ImageWithFallbackProps) {
  const [imageSrc, setImageSrc] = useState<string>(src);
  return (
    <Image
      style={{ objectFit: "contain" }}
      {...rest}
      src={imageSrc}
      alt={"axie"}
      onErrorCapture={() => {
        setImageSrc(fallbackSrc);
      }}
      className="overflow-hidden whitespace-nowrap indent-[100%] transition-transform hover:scale-105"
      unoptimized
      {...(priority ? {} : { loading: "lazy" })}
      priority={priority}
    />
  );
}
