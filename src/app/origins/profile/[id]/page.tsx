import { Suspense } from "react";
import type { UserID } from "lib/validators";
import { OriginProfile } from "components/OriginProfile";
import { OriginProfileSkeleton } from "components/OriginProfileSkeleton";

interface ProfilePageProps {
  params: {
    id: UserID;
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
