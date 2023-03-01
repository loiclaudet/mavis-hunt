import { userIdToTwitchChannelMap } from "data/players";
import Link from "next/link";
import Image from "next/image";
import type { UserID } from "lib/validators";

interface TwitchDetailsProps {
  userId: UserID;
  live?: boolean;
  leaderboardIndex?: number;
}
export default function TwitchDetails({
  userId,
  live,
  leaderboardIndex,
}: TwitchDetailsProps) {
  const twitchChannel = userIdToTwitchChannelMap.get(userId);
  if (!twitchChannel) {
    return null;
  }

  return (
    <div className="absolute left-auto right-0 top-2 z-10 flex items-center sm:left-2 sm:right-auto">
      <Link
        href={`https://www.twitch.tv/${twitchChannel}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Go to Twitch channel"
        className="relative mr-2 h-5 w-5 cursor-pointer self-end transition-transform hover:scale-110"
      >
        <Image
          src={`/twitch.png`}
          alt={"twitch channel"}
          fill={true}
          unoptimized
        />
      </Link>
      {typeof leaderboardIndex === "number" && (
        <span
          className="mr-2"
          style={{
            textShadow: "-2px 2px 3px #9146FF",
          }}
        >{`#${leaderboardIndex + 1}`}</span>
      )}

      {live && (
        <Link
          href={`https://www.twitch.tv/${twitchChannel}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Go to Twitch channel"
          className="mr-2 cursor-pointer"
        >
          <div
            style={{
              clipPath: "inset(0 0 0 0)",
            }}
            className="flex items-center justify-center overflow-hidden rounded bg-[#9146FF] px-2"
          >
            <span className="text-sm font-semibold text-white">LIVE</span>
            <div
              className="absolute -top-1/2 -left-full h-[200%] w-[200%] animate-slide opacity-0"
              style={{
                background:
                  "linear-gradient(90deg,hsla(0,0%,100%,.1) 0,hsla(0,0%,100%,.15) 77%,hsla(0,0%,100%,.85) 92%,hsla(0,0%,100%,0))",
              }}
            ></div>
          </div>
        </Link>
      )}
    </div>
  );
}
