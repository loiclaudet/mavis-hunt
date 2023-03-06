import { getSeasons } from "lib/api";
import { SEASON_DURATION } from "lib/consts";
import { DateTime } from "luxon";
import { MilliAXSButton } from "./MilliAXSButton";
import SeasonCountDown from "./SeasonCountdown";

export async function Season() {
  const season = await getData();
  if (!season) {
    return <div>Error when fetching season data, please refresh the page</div>;
  }
  const now = DateTime.now().toMillis();
  const periodDuration = season.endedAt * 1000 - now;
  const isOffSeason = periodDuration > SEASON_DURATION;
  //   const isOffSeason = periodDuration < 0 || periodDuration > SEASON_DURATION;
  return (
    <div className="flex flex-row justify-around sm:flex-col">
      <div className="flex flex-col justify-center">
        <h1 className={`text-2xl sm:text-4xl`}>
          {isOffSeason ? "Off-season" : `🔥 ${season.name} 🔥`}
        </h1>
        <div className="mb-3 flex items-center self-center sm:mb-0">
          <MilliAXSButton />
          {season.endedAt && (
            <SeasonCountDown
              endDate={Number(
                isOffSeason
                  ? now + (periodDuration - SEASON_DURATION)
                  : season.endedAt * 1000
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
}

async function getData() {
  const seasons = await getSeasons();
  const latestSeason = seasons?._items?.at(-1);
  return latestSeason;
}
