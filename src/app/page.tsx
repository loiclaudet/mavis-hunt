import AnimatedWine from "components/AnimatedWine";
import Search from "components/Search";

export const metadata = {
  title: "Axie.Wine | Search",
  description: "Origins Search for Axie Infinity players",
};

export default function Home() {
  return (
    <div className="mb-44 flex h-screen w-full flex-col items-center justify-center overflow-hidden sm:mb-0">
      <Search />
      <div className="relative max-h-[100vw] w-[350px] max-w-[100vw] sm:h-[600px] sm:w-[650px]">
        <AnimatedWine />
      </div>
    </div>
  );
}
