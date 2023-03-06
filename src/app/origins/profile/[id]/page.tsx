import { Suspense } from "react";
import type { UserID } from "lib/validators";
import { OriginProfile } from "components/OriginProfile";
import { OriginProfileSkeleton } from "components/OriginProfileSkeleton";
import { getLeaderBoard } from "lib/api";

interface ProfilePageProps {
  params: {
    id: UserID;
  };
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const userID = params.id;
  const usersResponse = await getLeaderBoard({ userID, limit: 1 });
  const user = usersResponse?._items?.at(0);
  const userName = user?.name;

  return {
    title: `🍷 ${
      userName ? `${userName} | Origins profile` : "Origins profile"
    }`,
    description: `🍷 Origins profile for ${userID}`,
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const userID = params.id;

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Suspense fallback={<OriginProfileSkeleton />}>
        {/* @ts-expect-error Server Component*/}
        <OriginProfile userID={userID} />
      </Suspense>
    </div>
  );
}
