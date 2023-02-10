import { z } from "zod";
// User ID
export const userIDValidator = z.string().uuid();
export type UserID = z.infer<typeof userIDValidator>;

// Rank
const RankEnum = z.enum([
  "Egg",
  "Chick",
  "Wolf",
  "Tiger",
  "Bear",
  "Boar",
  "Dragon",
  "Challenger",
]);
export type RankEnum = z.infer<typeof RankEnum>;

// Leaderboard
const leaderboardValidator = z.object({
  _items: z.array(
    z.object({
      userID: z.string().uuid(),
      name: z.string().min(1).max(50),
      rank: RankEnum,
      tier: z.number().min(0),
      topRank: z.number().min(1),
      vstar: z.number().min(0),
      avatar: z.string().nullable(),
    })
  ),
});

export type Leaderboard = z.infer<typeof leaderboardValidator>;

export const AxieTypeEnum = z.enum(["starter", "0", "ronin", "1"]);
export const AxiePartEnum = z.enum([
  "eyes",
  "mouth",
  "ears",
  "horn",
  "back",
  "tail",
]);

const CharmsValidator = z.object({
  eyes: z.string(),
  mouth: z.string(),
  ears: z.string(),
  horn: z.string(),
  back: z.string(),
  tail: z.string(),
});

export type Charms = z.infer<typeof CharmsValidator>;
export type AxieType = z.infer<typeof AxieTypeEnum>;
export type AxiePart = z.infer<typeof AxiePartEnum>;

export type Parts<T> = {
  [key in AxiePart]: T;
};

export type CharmsType = Parts<string>;

// Rewards
const rewardValidator = z.object({
  user_id: userIDValidator,
  new_vstar: z.number().min(0),
  old_vstar: z.number().min(0),
  result: z.enum(["win", "lose"]),
  items: z.array(
    z.object({
      item_id: z.enum(["exp", "moonshard", "slp"]),
      quantity: z.number().min(0),
    })
  ),
});

// User Rank
const userRankValidator = z.object({
  division: RankEnum,
  tier: z.number().min(0), // 0 is the highest tier (Challenger)
});

// Fighter
const fighterValidator = z.object({
  gene: z.string().startsWith("0x"),
  axie_id: z.number().min(1),
  axie_type: AxieTypeEnum,
  runes: z.array(z.string().min(1)),
  charms: CharmsValidator,
});
// Battles
const battleValidator = z.object({
  battle_uuid: z.string().uuid(),
  client_ids: z.tuple([userIDValidator, userIDValidator]),
  team_ids: z.tuple([z.number().min(1), z.number().min(1)]),
  created_at: z.string().datetime(),
  winner: z.number().min(0).max(1),
  battle_type: z.number(),
  battle_type_string: z.enum(["pve", "pvp", "ranked_pvp"]),
  chimera_party_id: z.string().optional(),
  first_client_fighters: z.tuple([
    fighterValidator,
    fighterValidator,
    fighterValidator,
  ]),
  second_client_fighters: z.tuple([
    fighterValidator,
    fighterValidator,
    fighterValidator,
  ]),
  rewards: z.tuple([rewardValidator, rewardValidator]),
  delta_rewards: z.tuple([rewardValidator, rewardValidator]),
  user_ranks: z.tuple([userRankValidator, userRankValidator]),
  started_time: z.number().min(0),
  ended_time: z.number().min(0),
  old_mmr: z.number().min(0),
  new_mmr: z.number().min(0),
});

export type Battle = z.infer<typeof battleValidator>;

const battleListValidator = z.object({
  battles: z.array(battleValidator).min(5).max(100),
});

export type Battles = z.infer<typeof battleListValidator>;
