import { z } from "zod";
import { LEADERBOARD_LIMIT, PROFILE_PLAYER_BATTLES } from "lib/consts";
import fetcher from "lib/fetcher";
import type { Battles, Items, Leaderboard } from "lib/validators";
import { userIDValidator } from "lib/validators";

// Leaderboard
const getLeaderBoardValidator = z.object({
  userID: userIDValidator.optional(),
  offset: z.number().min(0).optional(),
  limit: z.number().min(0).max(LEADERBOARD_LIMIT).optional(),
});
type UseLeaderboardProps = z.infer<typeof getLeaderBoardValidator>;

export function getLeaderBoard({
  userID,
  offset = 0,
  limit = LEADERBOARD_LIMIT,
}: UseLeaderboardProps): Promise<Leaderboard | undefined> {
  const userIDQuery = userID ? `&userID=${userID}` : "";

  return fetcher(
    `https://api-gateway.skymavis.com/origin/v2/leaderboards?limit=${limit}&offset=${offset}${userIDQuery}`,
    { revalidate: 180 }
  ) as Promise<Leaderboard | undefined>;
}

// Battles
const getBattlesValidator = z.object({
  userID: userIDValidator,
  esport: z.boolean().optional(),
  limit: z.number().min(5).max(100).optional(),
  page: z.number().min(1).max(20).optional(),
  type: z.enum(["pvp", "pve"]).optional(),
});

type UseBattlesProps = z.infer<typeof getBattlesValidator>;

export function getBattles({
  userID,
  limit = PROFILE_PLAYER_BATTLES,
  page = 1, // the API will return the battles from the limit * (page - 1) to the limit * page
  esport = false,
  type = "pvp",
}: UseBattlesProps): Promise<Battles | undefined> {
  return fetcher(
    `https://api-gateway.skymavis.com/x/origin${
      esport ? "-esport" : ""
    }/battle-history?type=${type}&client_id=${userID}&limit=${limit}&page=${page}`,
    { revalidate: 180 }
  ) as Promise<Battles | undefined>;
}

// Charms
export function getCharms(): Promise<Items | undefined> {
  return fetcher(
    "https://api-gateway.skymavis.com/origin/v2/community/charms",
    { revalidate: 3600 }
  ) as Promise<Items | undefined>;
}
// Runes
export function getRunes(): Promise<Items | undefined> {
  return fetcher("https://api-gateway.skymavis.com/origin/v2/community/runes", {
    revalidate: 3600,
  }) as Promise<Items | undefined>;
}

export interface StreamerChannel {
  name: string;
  live: boolean;
  title?: string;
}

interface StreamerChannelResponse {
  data: StreamerChannel[];
}

export async function getStreamerChannel(
  channel: string
): Promise<StreamerChannel> {
  try {
    const response = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=${channel}`,
      {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID as string,
          Authorization: `Bearer ${process.env.TWITCH_ACCESS_TOKEN as string}`,
        },
      }
    );
    const streamerChannelResponse =
      (await response.json()) as StreamerChannelResponse;
    if (
      !streamerChannelResponse?.data ||
      streamerChannelResponse?.data?.length === 0
    ) {
      return {
        name: channel,
        live: false,
      };
    }

    return {
      name: channel,
      live: true,
      title: streamerChannelResponse.data?.[0]?.title,
    };
  } catch (e) {
    console.error(e);
    return {
      name: channel,
      live: false,
    };
  }
}
const SeasonValidator = z.object({
  id: z.number(),
  startedAt: z.number().min(0),
  endedAt: z.number().min(0),
  name: z.string(),
  seasonPassID: z.string(),
  description: z.string(),
});

const getSeasonsValidator = z.object({
  _items: z.array(SeasonValidator),
});

export type Season = z.infer<typeof SeasonValidator>;
type Seasons = z.infer<typeof getSeasonsValidator>;

export function getSeasons(): Promise<Seasons | undefined> {
  return fetcher(
    process.env.ORIGIN_SEASON_PRIVATE_ENDPOINT as string
  ) as Promise<Seasons | undefined>;
}
