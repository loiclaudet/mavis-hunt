import Bottleneck from "bottleneck";
import type { Battle, Battles, Leaderboard, User } from "lib/validators";
import { getBattles, getCharms, getLeaderBoard, getRunes } from "lib/api";
import { createPlayer } from "lib/createPlayer";
import {
  LEADERBOARD_PLAYER_BATTLES,
  ORIGIN_RATE_LIMIT_PER_SEC,
  X_RATE_LIMIT_PER_SEC,
} from "lib/consts";
import { Suspense } from "react";
import { userIdToTwitchChannelMap } from "data/players";
import OriginPlayer from "components/OriginPlayer";
import { PlayerListSkeleton } from "components/PlayerListSkeleton";
import chunk from "lib/chunk";
import type { Rune } from "lib/runes";
import type { Charm } from "lib/charms";

export default async function OriginsLeaderboardPage() {
  const twitchUsersIDs = Array.from(userIdToTwitchChannelMap.keys());

  // limit the number of requests to the origin API to 10 per second
  const originAPILimiter = new Bottleneck({
    minTime: 1000 / ORIGIN_RATE_LIMIT_PER_SEC + 100 * ORIGIN_RATE_LIMIT_PER_SEC, // add 10ms per request to safely avoid to reach rate limit
    maxConcurrent: ORIGIN_RATE_LIMIT_PER_SEC,
  });
  const wrappedGetLeaderboard = originAPILimiter.wrap(getLeaderBoard);

  const leaderboardPromise = twitchUsersIDs.map((userID) =>
    wrappedGetLeaderboard({ userID, limit: 1 })
  );

  // limit the number of requests to the x API to 10 per second
  const xAPILimiter = new Bottleneck({
    minTime: 1000 / X_RATE_LIMIT_PER_SEC + 10 * X_RATE_LIMIT_PER_SEC, // add 10ms per request to safely avoid to reach rate limit
    maxConcurrent: X_RATE_LIMIT_PER_SEC,
  });
  const wrappedGetBattles = xAPILimiter.wrap(getBattles);

  const usersBattlesPromises = twitchUsersIDs.map((userID) =>
    wrappedGetBattles({ userID, limit: LEADERBOARD_PLAYER_BATTLES })
  );

  // TODO: use parallel requests
  const [runesResponse, charmsResponse] = await Promise.all([
    getRunes(),
    getCharms(),
  ]);

  const runes = runesResponse._items.map((el) => el.item);
  const charms = charmsResponse._items.map((el) => el.item);
  // leaderboard API limit is reached earlier than battles, so we need to
  // chunk the requests based on ORIGIN_RATE_LIMIT_PER_SEC rate limit
  const usersBattlesPromisesChunked = chunk(
    usersBattlesPromises,
    ORIGIN_RATE_LIMIT_PER_SEC
  );

  return (
    <div className="flex max-w-full flex-col items-center overflow-hidden">
      {chunk(leaderboardPromise, ORIGIN_RATE_LIMIT_PER_SEC).map(
        (promises, index) => {
          return (
            <Suspense
              fallback={
                <PlayerListSkeleton playersQuantity={promises.length} />
              }
              key={index}
            >
              {/* @ts-expect-error Server Component*/}
              <PlayerList
                usersBattlesPromises={
                  usersBattlesPromisesChunked[index] as Promise<Battles>[]
                }
                leaderboardPromise={promises}
                runes={runes}
                charms={charms}
              />
            </Suspense>
          );
        }
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      <Suspense fallback={<div>Loading...</div>}>
        {/* @ts-expect-error Server Component*/}
        <PlayerList
          usersBattlesPromises={usersBattlesPromises}
          leaderboardPromise={leaderboardPromise}
        />
      </Suspense>
    </div>
  );
}

interface PlayerListProps {
  leaderboardPromise: Promise<Leaderboard>[];
  usersBattlesPromises: Promise<Battles>[];
  runes: Rune[];
  charms: Charm[];
}

async function PlayerList({
  leaderboardPromise,
  usersBattlesPromises,
  runes,
  charms,
}: PlayerListProps) {
  const [usersResponse, usersBattlesResponse] = await Promise.all([
    Promise.all(leaderboardPromise),
    Promise.all(usersBattlesPromises),
  ]);

  const userBattles = usersBattlesResponse.map((response) => {
    return response?.battles ?? [];
  });

  const users = usersResponse.map((user) => user._items[0] as User);

  const players = users
    .map((user, index) => {
      return createPlayer({
        battles: userBattles[index] as Battle[],
        user,
        runes,
        charms,
      });
    })
    .sort((a, b) => a.topRank - b.topRank);
  return (
    <>
      {players.map((_player) => (
        <OriginPlayer
          key={_player.userID}
          player={_player}
          runes={runes}
          charms={charms}
        />
      ))}
    </>
  );
}
