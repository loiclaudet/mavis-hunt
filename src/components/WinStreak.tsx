"use client";
import { useState } from "react";

interface WinStreakProps {
  streak: number;
}
export default function WinStreak({ streak }: WinStreakProps) {
  const [isHover, setIsHover] = useState<boolean>(false);
  return (
    <div
      className="min-h-[2rem] select-none"
      style={{
        filter: `hue-rotate(${72 * (streak - 5)}deg)`,
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onTouchStart={() => setIsHover((state) => !state)}
    >
      {isHover ? (
        <span className="cursor-default select-none text-sm font-bold text-[#F56802]">
          Streak&nbsp;
          <span className="text-base font-bold text-[#FFD44C]">+{streak}</span>
        </span>
      ) : (
        <span className="select-none text-2xl">{`${"🔥".repeat(
          Math.floor(streak / 5)
        )}`}</span>
      )}
    </div>
  );
}
