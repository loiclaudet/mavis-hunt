import { Suspense } from "react";
import type { UserID } from "lib/validators";
import { useBattles, useLeaderBoard, useCharms, useRunes } from "lib/api";
import { getPlayer } from "lib/getPlayer";
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
    { _items: players },
    { battles: battles },
    { _items: charms },
    { _items: runes },
  ] = await Promise.all([
    useLeaderBoard({ userID, limit: 1 }),
    useBattles({ userID }),
    useCharms(),
    useRunes(),
  ]);
  if (!players[0]) return <p>user not found</p>;
  const player = getPlayer({ battles, player: players[0] });

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
          ref={null}
          player={{
            ...player,
            battles: player.battles.slice(0, MAX_DISPLAYED_PLAYER_BATTLES),
          }}
          runes={runes.map((rune) => rune.item)}
          charms={charms.map((charm) => charm.item)}
          key={player.userID}
        />
      </Suspense>
      <ArenaStarsChart data={chartData} />
    </div>
  );
}
