import Bottleneck from "bottleneck";
import type { Battle, Battles, Item, User } from "lib/validators";
import { getBattles, getLeaderBoard, getCharms, getRunes } from "lib/api";
import type { Player } from "lib/createPlayer";
import { createPlayer } from "lib/createPlayer";
import {
  LEADERBOARD_LIMIT,
  LEADERBOARD_PLAYER_BATTLES,
  X_RATE_LIMIT_PER_SEC,
} from "lib/consts";
import OriginPlayer from "components/OriginPlayer";
import { Suspense } from "react";
import chunk from "lib/chunk";

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

  const [{ _items: users }, { _items: charms }, { _items: runes }] =
    await Promise.all([
      getLeaderBoard({ offset, limit: LEADERBOARD_LIMIT }),
      getCharms(),
      getRunes(),
    ]);

  const criticalUsers = users.slice(0, 10);
  const deferredUsers = users.slice(10);

  // limit the number of requests to the API to 10 per second
  const limiter = new Bottleneck({
    minTime: 1000 / X_RATE_LIMIT_PER_SEC,
    maxConcurrent: X_RATE_LIMIT_PER_SEC,
  });
  const wrappedGetBattles = limiter.wrap(getBattles);

  const criticalUsersBattlesPromises = criticalUsers.map(({ userID }) =>
    wrappedGetBattles({ userID, limit: LEADERBOARD_PLAYER_BATTLES })
  );
  const criticalUsersBattles = (
    await Promise.all(criticalUsersBattlesPromises)
  ).map((battles) => battles?.battles ?? []);

  const players = criticalUsers.map((user, index) => {
    return createPlayer({
      battles: criticalUsersBattles[index] as Battle[],
      user,
    });
  });
  const deferredUsersBattlesPromises = deferredUsers.map(({ userID }) =>
    wrappedGetBattles({ userID, limit: LEADERBOARD_PLAYER_BATTLES })
  );

  return (
    <div className="flex flex-col items-center">
      <PlayerList charms={charms} runes={runes} players={players} />
      {chunk(deferredUsersBattlesPromises, X_RATE_LIMIT_PER_SEC).map(
        (promises, index) => {
          return (
            <Suspense fallback={<div>Loading...</div>} key={index}>
              {/* @ts-expect-error Server Component*/}
              <DeferredPlayerList
                charms={charms}
                runes={runes}
                userBattlesPromises={promises}
                users={deferredUsers.slice(
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

interface DeferredPlayerListProps {
  userBattlesPromises: Promise<Battles>[];
  users: User[];
  runes: Item[];
  charms: Item[];
}

async function DeferredPlayerList({
  userBattlesPromises,
  users,
  runes,
  charms,
}: DeferredPlayerListProps) {
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
        <OriginPlayer
          ref={null}
          key={_player.userID}
          player={_player}
          runes={runes.map((rune) => rune.item)}
          charms={charms.map((charm) => charm.item)}
        />
      ))}
    </>
  );
}
interface PlayerListProps {
  players: Player[];
  runes: Item[];
  charms: Item[];
}

function PlayerList({ players, runes, charms }: PlayerListProps) {
  return (
    <>
      {players.map((_player) => (
        <OriginPlayer
          ref={null}
          key={_player.userID}
          player={_player}
          runes={runes.map((rune) => rune.item)}
          charms={charms.map((charm) => charm.item)}
        />
      ))}
    </>
  );
}
