import { Suspense } from "react";
import WinStreak from "../components/WinStreak";

export default async function Home() {
  const fakePromise = await new Promise((res) => {
    return setTimeout(() => res("ok"), 0);
  });
  console.log(fakePromise);
  return (
    <>
      <Suspense fallback={<p>loading...</p>}>
        <WinStreak streak={6} />
      </Suspense>
    </>
  );
}
