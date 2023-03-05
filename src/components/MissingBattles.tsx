"use client";
import { LEADERBOARD_PLAYER_BATTLES, PROFILE_PLAYER_BATTLES } from "lib/consts";
import Link from "next/link";
import { useState } from "react";

interface MissingBattlesProps {
  userID: string;
}

export function MissingBattles({ userID }: MissingBattlesProps) {
  const [displayDetails, setDisplayDetails] = useState<boolean>(false);
  return (
    <>
      {displayDetails ? (
        <div className="pt- max-w-[600px]">
          <p className="mb-2 w-full text-lg font-semibold">
            {`Last ${LEADERBOARD_PLAYER_BATTLES} battles are not PVP arena battles.`}
          </p>
          <div>
            <span>{`Look at player's `}</span>
            <Link
              href={`/origins/profile/${userID}`}
              className="text-blue-500 underline"
              prefetch={false}
            >
              profile page
            </Link>
            <span>{` based on last ${PROFILE_PLAYER_BATTLES} battles to get a chance to see its last arena team.`}</span>
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center justify-center">
          <button
            onClick={() => setDisplayDetails(true)}
            className="rounded-1 mr-2 flex h-4 w-2 items-center justify-center p-3 text-white transition-transform hover:scale-105"
          >
            <span className="font-bold">i</span>
          </button>
          <p className="font-semibold">Missing player battles data 🫠</p>
        </div>
      )}
    </>
  );
}
