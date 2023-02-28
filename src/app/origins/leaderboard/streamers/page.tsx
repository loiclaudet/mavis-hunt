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

export default function OriginsLeaderboardPage() {
  const twitchUsersIDs = Array.from(userIdToTwitchChannelMap.keys()).slice(
    0,
    5
  );

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
}

async function PlayerList({
  leaderboardPromise,
  usersBattlesPromises,
}: PlayerListProps) {
  const [usersResponse, usersBattlesResponse] = await Promise.all([
    Promise.all(leaderboardPromise),
    Promise.all(usersBattlesPromises),
  ]);
  // TODO: use parallel requests
  const [{ _items: runes }, { _items: charms }] = await Promise.all([
    getRunes(),
    getCharms(),
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
        runes: runes.map((rune) => rune.item),
        charms: charms.map((charm) => charm.item),
      });
    })
    .sort((a, b) => a.topRank - b.topRank);
  return (
    <>
      {players.map((_player) => (
        <OriginPlayer key={_player.userID} player={_player} />
      ))}
    </>
  );
}
