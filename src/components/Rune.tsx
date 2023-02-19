import Image from "next/image";
interface RuneProps {
  runeImageUrl: string | null;
  battleContext?: boolean;
  displayRuneEffect: (runeImageUrl: string | null) => void;
}
export default function RuneComponent({
  runeImageUrl,
  battleContext,
  displayRuneEffect,
}: RuneProps) {
  if (!runeImageUrl) {
    return null;
  }
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative mb-1 transition-transform hover:scale-125 ${
        battleContext ? "h-5 w-5 sm:h-7 sm:w-7" : "h-6 w-6 sm:h-8 sm:w-8"
      }`}
    >
      <Image
        src={runeImageUrl}
        alt={"rune"}
        loading="lazy"
        fill={true}
        unoptimized
      />
    </div>
  );
  function handleMouseEnter() {
    displayRuneEffect(runeImageUrl);
  }
  function handleMouseLeave() {
    displayRuneEffect(null);
  }
}
