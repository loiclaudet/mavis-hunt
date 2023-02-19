import Image from "next/image";

export default function Social() {
  return (
    <div className="fixed bottom-2 right-2 z-30 hidden flex-col items-center justify-around rounded bg-[rgba(255,255,255,.15)] p-2 sm:flex">
      <div className="mb-4 flex flex-col items-center">
        <p className="text-xs font-light">Powered by</p>
        <p className="text-xl font-bold">Axie.Wine 🍷</p>
      </div>
      <div className="flex flex-col items-center">
        <p className="font-normal">Any request?</p>
        <a
          href="https://twitter.com/0xLodz"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center hover:underline"
        >
          <p className="font-normal">Reach me out on twitter</p>
          <div className="relative h-10 w-10">
            <Image
              src={"/lodz.jpeg"}
              width={40}
              height={40}
              alt="twitter avatar"
              className="rounded-full transition-transform hover:scale-110"
            />
          </div>
        </a>
      </div>
    </div>
  );
}
