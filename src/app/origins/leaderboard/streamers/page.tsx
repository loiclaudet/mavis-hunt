import Bottleneck from "bottleneck";
import type { Battle, Battles, Leaderboard, User } from "lib/validators";
import type { StreamerChannel } from "lib/api";
import {
  getBattles,
  getCharms,
  getLeaderBoard,
  getRunes,
  getStreamerChannel,
} from "lib/api";
import type { Player } from "lib/createPlayer";
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

export const metadata = {
  title: "🍷 Origins Streamers",
  description: "🍷 Origins Streamers",
};

export default async function OriginsStreamersPage() {
  const {
    runes,
    charms,
    streamersChannelsPromises,
    leaderboardPromise,
    usersBattlesPromises,
  } = await getData();

  if (!runes || !charms) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-lg font-bold sm:text-2xl">
          Ooops! Error when retrieving data, please refresh the page!
        </p>
      </div>
    );
  }

  // leaderboard API rate limit is 5/sec for users (origin endpoints), while battles is 10/sec.
  // Thus we need to chunk the other requests based on ORIGIN_RATE_LIMIT_PER_SEC rate limit
  const usersBattlesPromisesChunked = chunk(
    usersBattlesPromises,
    ORIGIN_RATE_LIMIT_PER_SEC
  );

  const streamersChannelsPromisesChunked = chunk(
    streamersChannelsPromises,
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
                streamersChannelsPromises={
                  streamersChannelsPromisesChunked[
                    index
                  ] as Promise<StreamerChannel>[]
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
}

interface PlayerListProps {
  leaderboardPromise: Promise<Leaderboard | undefined>[];
  usersBattlesPromises: Promise<Battles | undefined>[];
  streamersChannelsPromises: Promise<StreamerChannel | undefined>[];
  runes: Rune[];
  charms: Charm[];
}

async function PlayerList({
  leaderboardPromise,
  usersBattlesPromises,
  streamersChannelsPromises,
  runes,
  charms,
}: PlayerListProps) {
  const [usersResponse, usersBattlesResponse, streamersChannelsResponse] =
    await Promise.all([
      Promise.allSettled(leaderboardPromise),
      Promise.allSettled(usersBattlesPromises),
      Promise.allSettled(streamersChannelsPromises),
    ]);

  const userBattles = usersBattlesResponse.map((response) => {
    if (response.status === "rejected") {
      return [];
    }
    return response.value?.battles ?? [];
  });

  const channels = streamersChannelsResponse.map((response) => {
    if (response.status === "rejected") {
      return undefined;
    }
    return response.value;
  });

  const users = usersResponse.map((userResponse) => {
    if (userResponse.status === "rejected") {
      return undefined;
    }
    return userResponse.value?._items?.[0];
  });

  const players = (
    users
      .map((user, index) => {
        if (!user) {
          return undefined;
        }
        return createPlayer({
          battles: userBattles[index] as Battle[],
          user: users[index] as User,
          runes,
          charms,
          ...(channels[index] ? { channel: channels[index] } : {}),
        });
      })
      .filter(Boolean) as Player[]
  ).sort((a, b) => a.topRank - b.topRank);
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

async function getData() {
  // TODO: fetch all data in parallel.
  // We need to limit the number of requests to the x API to 10 per second.
  const [runesResponse, charmsResponse] = await Promise.all([
    getRunes(),
    getCharms(),
  ]);
  const runes = runesResponse?._items.map((el) => el.item);
  const charms = charmsResponse?._items.map((el) => el.item);

  const twitchUsersIDs = Array.from(userIdToTwitchChannelMap.keys());
  const usersChannelNames = Array.from(userIdToTwitchChannelMap.values());
  const streamersChannelsPromises = usersChannelNames.map((channel) =>
    getStreamerChannel(channel)
  );

  // limit the number of requests to the origin API to 10 per second
  const originAPILimiter = new Bottleneck({
    minTime: 1000 / ORIGIN_RATE_LIMIT_PER_SEC + 50 * ORIGIN_RATE_LIMIT_PER_SEC, // add 50ms per request to safely avoid to reach rate limit
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

  return {
    runes,
    charms,
    streamersChannelsPromises,
    leaderboardPromise,
    usersBattlesPromises,
  };
}
