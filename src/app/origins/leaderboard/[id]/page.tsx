import Bottleneck from "bottleneck";
import type { Battle, Battles, User } from "lib/validators";
import { getBattles, getLeaderBoard } from "lib/api";
import { createPlayer } from "lib/createPlayer";
import {
  LEADERBOARD_LIMIT,
  LEADERBOARD_PLAYER_BATTLES,
  X_RATE_LIMIT_PER_SEC,
} from "lib/consts";
import { Suspense } from "react";
import chunk from "lib/chunk";
import OriginPlayer from "components/OriginPlayer";
import OriginPlayerSkeleton from "components/OriginPlayerSkeleton";

interface OriginsLeaderboardPageProps {
  params: {
    id: string;
  };
}

export default async function OriginsLeaderboardPage({
  params,
}: OriginsLeaderboardPageProps) {
  const pageID = Number(params.id);
  const offset = pageID * LEADERBOARD_LIMIT - LEADERBOARD_LIMIT;

  const [{ _items: users }] = await Promise.all([
    getLeaderBoard({ offset, limit: LEADERBOARD_LIMIT }),
  ]);

  // limit the number of requests to the API to 10 per second
  const limiter = new Bottleneck({
    minTime: 1000 / X_RATE_LIMIT_PER_SEC + 10 * X_RATE_LIMIT_PER_SEC, // add 10ms per request to safely avoid to reach rate limit
    maxConcurrent: X_RATE_LIMIT_PER_SEC,
  });
  const wrappedGetBattles = limiter.wrap(getBattles);

  const usersBattlesPromises = users.map(({ userID }) =>
    wrappedGetBattles({ userID, limit: LEADERBOARD_PLAYER_BATTLES })
  );

  return (
    <div className="flex flex-col items-center">
      {chunk(usersBattlesPromises, X_RATE_LIMIT_PER_SEC).map(
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
                userBattlesPromises={promises}
                users={users.slice(
                  index * X_RATE_LIMIT_PER_SEC,
                  (index + 1) * X_RATE_LIMIT_PER_SEC
                )}
              />
            </Suspense>
          );
        }
      )}
    </div>
  );
}

interface PlayerListProps {
  userBattlesPromises: Promise<Battles>[];
  users: User[];
}

async function PlayerList({ userBattlesPromises, users }: PlayerListProps) {
  const userBattles = (await Promise.all(userBattlesPromises)).map(
    (battles) => battles?.battles ?? []
  );

  const players = users.map((user, index) => {
    return createPlayer({
      battles: userBattles[index] as Battle[],
      user,
    });
  });
  return (
    <>
      {players.map((_player) => (
        <OriginPlayer key={_player.userID} player={_player} />
      ))}
    </>
  );
}

interface PlayerListSkeletonProps {
  playersQuantity: number;
}
function PlayerListSkeleton({ playersQuantity }: PlayerListSkeletonProps) {
  return (
    <>
      {new Array(playersQuantity).fill(null).map((_, index) => {
        return <OriginPlayerSkeleton key={index} />;
      })}
    </>
  );
}
