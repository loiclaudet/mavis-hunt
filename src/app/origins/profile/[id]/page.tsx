import { Suspense } from "react";
import type { UserID } from "lib/validators";
import { getBattles, getLeaderBoard, getCharms, getRunes } from "lib/api";
import { createPlayer } from "lib/createPlayer";
import { relativeTime } from "lib/relativeTime";
import { MAX_DISPLAYED_PLAYER_BATTLES } from "lib/consts";
import ArenaStarsChart from "components/ArenaStarsChart";
import OriginProfile from "components/OriginProfile";

interface ProfilePageProps {
  params: {
    id: UserID;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const userID = params.id;
  // TODO: refactor this page to follow the island pattern and display components skeletons
  // it will improve the performance of the page
  const [
    { _items: users },
    { battles: battles },
    { _items: charms },
    { _items: runes },
  ] = await Promise.all([
    getLeaderBoard({ userID, limit: 1 }),
    getBattles({ userID }),
    getCharms(),
    getRunes(),
  ]);
  if (!users[0]) return <p>user not found</p>;
  const player = createPlayer({
    battles,
    user: users[0],
    runes: runes.map((rune) => rune.item),
    charms: charms.map((charm) => charm.item),
  });

  const chartData = player.battles
    .map((battle) => {
      const reward = battle.rewards.find((reward) => reward.user_id === userID);
      return {
        startedAt: relativeTime(battle.created_at, "long"),
        stars: reward?.new_vstar,
      };
    })
    .reverse();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Suspense fallback={<p>loading...</p>}>
        <OriginProfile
          player={{
            ...player,
            battles: player.battles.slice(0, MAX_DISPLAYED_PLAYER_BATTLES),
          }}
          runes={runes.map((rune) => rune.item)}
          charms={charms.map((charm) => charm.item)}
        />
      </Suspense>
      <ArenaStarsChart data={chartData} />
    </div>
  );
}
