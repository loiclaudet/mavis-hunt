import { z } from "zod";
import { LEADERBOARD_LIMIT, PROFILE_PLAYER_BATTLES } from "lib/consts";
import fetcher from "lib/fetcher";
import type { Battles, Leaderboard } from "lib/validators";
import { userIDValidator } from "lib/validators";

// Leaderboard
const useLeaderBoardValidator = z.object({
  userID: userIDValidator.optional(),
  offset: z.number().min(0).optional(),
  limit: z.number().min(0).max(LEADERBOARD_LIMIT).optional(),
});
type UseLeaderboardProps = z.infer<typeof useLeaderBoardValidator>;

export function useLeaderBoard({
  userID,
  offset = 0,
  limit = LEADERBOARD_LIMIT,
}: UseLeaderboardProps): Promise<Leaderboard> {
  const userIDQuery = userID ? `&userID=${userID}` : "";

  return fetcher(
    `https://api-gateway.skymavis.com/origin/v2/leaderboards?limit=${limit}&offset=${offset}${userIDQuery}`
  ) as Promise<Leaderboard>;
}

// Battles
const useBattlesValidator = z.object({
  userID: userIDValidator,
  esport: z.boolean().optional(),
  limit: z.number().min(5).max(100).optional(),
  page: z.number().min(1).max(20).optional(),
  type: z.enum(["pvp", "pve"]).optional(),
});

type UseBattlesProps = z.infer<typeof useBattlesValidator>;

export function useBattles({
  userID,
  limit = PROFILE_PLAYER_BATTLES,
  page = 1, // the API will return the battles from the limit * (page - 1) to the limit * page
  esport = false,
  type = "pvp",
}: UseBattlesProps): Promise<Battles> {
  return fetcher(
    `https://api-gateway.skymavis.com/x/origin${
      esport ? "-esport" : ""
    }/battle-history?type=${type}&client_id=${userID}&limit=${limit}&page=${page}`
  ) as Promise<Battles>;
}
