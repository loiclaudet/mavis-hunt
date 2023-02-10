"use client";
import Image from "next/image";

import { useEffect, useState } from "react";
export default function Switch() {
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    setTheme(localStorage.getItem("theme") ?? "dark");
  }, []);
  return (
    <>
      <div
        title={
          theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
        }
        className="fixed top-2 right-2 z-50 hidden h-6 w-6 cursor-pointer sm:block"
        onClick={toggleTheme}
      >
        {theme === "dark" ? (
          <Image
            src={`/dusk.svg`}
            alt="dark"
            loading="lazy"
            fill={true}
            unoptimized
          />
        ) : (
          <Image
            src={`/dawn.svg`}
            alt="light"
            loading="lazy"
            fill={true}
            unoptimized
          />
        )}
      </div>
      <div
        style={{
          backgroundImage: "url(/wallpaper.webp)",
          filter:
            theme === "dark"
              ? "hue-rotate(130deg) brightness(.75) contrast(1.5) saturate(.5)"
              : "none",
        }}
        className={`user-select-none fixed top-0 left-0 right-0 bottom-0 z-[-1] h-full w-full 
            bg-cover bg-center bg-no-repeat`}
      ></div>
    </>
  );

  function toggleTheme() {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }
}
