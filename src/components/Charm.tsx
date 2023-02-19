import Image from "next/image";

interface CharmProps {
  charmImageUrl: string | null;
  battleContext?: boolean;
  highLightCharm: (charmImageUrl: string | null) => void;
}
export default function CharmComponent({
  charmImageUrl,
  battleContext,
  highLightCharm,
}: CharmProps) {
  const battleStyle = battleContext
    ? "h-[13px] max-h-[13px] w-[12px] max-w-[12px] rounded-[2px] sm:h-[12px] sm:max-h-[12px] sm:w-[10px] sm:max-w-[10px]"
    : "h-[17px] max-h-[17px] w-[15px] max-w-[15px] sm:max-h-[17px] sm:max-w-[15px]";

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative mr-[2px] transition-transform sm:mr-1 sm:hover:scale-110 ${
        battleContext
          ? "mr-0 h-[28px] w-[20px] sm:mr-[1px] sm:h-[28px] sm:w-[20px]"
          : "h-[33px] w-[24px] sm:h-[33px] sm:w-[24px]"
      } ${
        !charmImageUrl
          ? ` mx-[5px] rounded border-[1px] border-dashed border-white ${battleStyle}`
          : ""
      }`}
    >
      {charmImageUrl && (
        <Image
          src={charmImageUrl}
          alt="charm"
          loading="lazy"
          fill={true}
          unoptimized
          style={{
            objectFit: "contain",
            objectPosition: "bottom",
          }}
        />
      )}
    </div>
  );
  function handleMouseEnter() {
    highLightCharm(charmImageUrl);
  }
  function handleMouseLeave() {
    highLightCharm(null);
  }
}
