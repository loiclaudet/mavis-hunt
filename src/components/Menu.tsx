"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BREAKPOINTS } from "lib/consts";

export default function Menu() {
  const [displayMenu, setDisplayMenu] = useState(false);
  const [clickedButtonUrl, setClickedButtonUrl] = useState<string | null>(null);
  const pathName = usePathname();

  useEffect(() => {
    setDisplayMenu(screen.width >= BREAKPOINTS.mobile);
  }, [clickedButtonUrl]);

  return (
    <div
      className={`fixed top-0 left-0 bottom-0 z-30 bg-[#2b1812eb] px-4 py-4 transition-transform ${
        displayMenu ? "-translate-x-0" : "-translate-x-full"
      }`}
    >
      <button
        onClick={() => setDisplayMenu(!displayMenu)}
        className={`absolute rounded-none bg-none text-2xl sm:hidden ${
          displayMenu
            ? "bottom-1 right-1 shadow-none"
            : "bottom-0 right-0 h-12 w-12 translate-x-full rounded-tr-md bg-[#2b1812eb]"
        }`}
      >
        {displayMenu ? "✕" : "☰"}
      </button>
      <h2 className="mb-6 text-2xl first-letter:uppercase sm:text-2xl">
        Origins
      </h2>
      <h3 className="mb-2 text-base first-letter:uppercase sm:text-xl">
        Search
      </h3>
      <ul className="mb-4">
        <li>
          <Button
            name="lunacians"
            imgUrl="/wine.png"
            url="/"
            routerPath={pathName}
            onClick={(url) => setClickedButtonUrl(url)}
          />
        </li>
      </ul>
      <h3 className="mb-2 text-xl first-letter:uppercase sm:text-xl">
        leaderboards
      </h3>
      <ul className="mb-4">
        <li>
          <Button
            name="lunacians"
            imgUrl="/origins.jpeg"
            url="/origins/leaderboard/1"
            routerPath={pathName}
            onClick={(url) => setClickedButtonUrl(url)}
          />
        </li>
        <li>
          <Button
            name="streamers"
            imgUrl="/twitch-icon.jpeg"
            url="/origins/leaderboard/streamers"
            routerPath={pathName}
            onClick={(url) => setClickedButtonUrl(url)}
          />
        </li>
        {/* <li>
          <Button
            name="Sky Mavis team"
            imgUrl="/skymavis-logo.png"
            url="/origins/leaderboard/skymavis"
            routerPath={pathName}
            onClick={(url) => setClickedButtonUrl(url)}
          />
        </li> */}
      </ul>
    </div>
  );
}

interface ButtonProps {
  name: string;
  url: string;
  imgUrl: string;
  inactive?: boolean;
  routerPath: string | null;
  onClick: (url: string) => void;
}

function Button({
  url,
  imgUrl,
  name,
  inactive,
  routerPath,
  onClick,
}: ButtonProps) {
  const isActivePage = routerPath === url;
  return (
    <div
      onClick={() => onClick(url)}
      className={`group relative box-border max-w-[178px] sm:mt-0 sm:max-w-none ${
        inactive ? "pointer-events-none cursor-not-allowed grayscale" : ""
      }`}
    >
      <Link
        href={{ pathname: url }}
        className={`${inactive ? "" : "group-hover:underline"}`}
        prefetch={false}
      >
        <div className="flex items-center py-2 sm:py-4">
          <div className={`relative mr-3 h-[25px] w-[25px] rounded`}>
            {isActivePage && (
              <div className="absolute top-1/2 -left-3 h-0 w-0 -translate-y-1/2 border-[4px] border-l-white border-b-transparent border-r-transparent border-t-transparent"></div>
            )}
            <Image
              priority
              src={imgUrl}
              alt={name}
              fill={true}
              unoptimized
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="flex flex-col">
            <span
              className={`text-sm text-white first-letter:uppercase ${
                isActivePage ? "text-base font-semibold" : ""
              }`}
            >
              {name}
            </span>
            {inactive && (
              <span className="text-[9px] first-letter:uppercase sm:text-[9px]">
                Coming soon
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
