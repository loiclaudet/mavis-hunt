import Image from "next/image";

export function MilliAXSButton() {
  return (
    <button
      style={{
        clipPath:
          "polygon(48% 2%, 61% 23%, 75% 4%, 96% 30%, 87% 51%, 80% 61%, 91% 87%, 52% 96%, 5% 90%)",
      }}
      className={`relative z-50 mr-1 h-6 w-8 overflow-hidden bg-white/5 bg-none shadow-none transition-transform hover:scale-105`}
    >
      <Image
        src={`/season-end-reward.png`}
        fill={true}
        alt="reward-icon"
        unoptimized
        style={{
          objectFit: "contain",
        }}
      />
      <div
        className="absolute -top-1/2 -left-full h-[200%] w-[200%] animate-slide opacity-0"
        style={{
          background:
            "linear-gradient(90deg,hsla(0,0%,100%,.1) 0,hsla(0,0%,100%,.15) 77%,hsla(0,0%,100%,.85) 92%,hsla(0,0%,100%,0))",
        }}
      ></div>
    </button>
  );
}
