import { Suspense } from "react";
import type { UserID } from "lib/validators";
import { useBattles, useLeaderBoard } from "lib/api";

interface ProfilePageProps {
  params: {
    id: UserID;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const userID = params.id;
  const leaderboard = await useLeaderBoard({ userID, limit: 1 });
  const battlesResponse = useBattles({ userID });
  const battles = await battlesResponse;
  return (
    <>
      <Suspense fallback={<p>loading...</p>}>
        <pre>
          <code>{JSON.stringify(leaderboard._items[0], null, 2)}</code>
        </pre>
        <pre>
          <code>{JSON.stringify(battles.battles[0], null, 2)}</code>
        </pre>
      </Suspense>
    </>
  );
}
