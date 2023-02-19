import { z } from "zod";
// User ID
export const userIDValidator = z.string().uuid();
export type UserID = z.infer<typeof userIDValidator>;

// Classes
const AxieClassEnum = z.enum([
  "Beast",
  "Bird",
  "Bug",
  "Plant",
  "Reptile",
  "Aquatic",
  "Dawn",
  "Dusk",
  "Mech",
]);

// Types
export const AxieTypeEnum = z.enum(["starter", "0", "ronin", "1"]);
export type AxieType = z.infer<typeof AxieTypeEnum>;

// Parts
export const AxiePartEnum = z.enum([
  "Eyes",
  "Mouth",
  "Ears",
  "Horn",
  "Back",
  "Tail",
]);
export type AxiePart = z.infer<typeof AxiePartEnum>;

const partsValidator = z.object({
  eyes: z.string(),
  mouth: z.string(),
  ears: z.string(),
  horn: z.string(),
  back: z.string(),
  tail: z.string(),
});
export type AxieParts = z.infer<typeof partsValidator>;

// Cards
const cardTypeEnums = z.enum(["normal", "japan", "mystic", "summer-2022"]);
export type CardType = z.infer<typeof cardTypeEnums>;

const cardValidator = z.object({
  partId: z.string().min(1),
  class: AxieClassEnum,
  partName: z.string().min(1),
  cardName: z.string().min(1),
  partType: AxiePartEnum,
  cardImage: z.string().url(),
  specialGenes: z.union([
    z.literal("japan"),
    z.literal("mystic"),
    z.literal("summer-2022"),
    z.null(),
  ]),
});
export type Card = z.infer<typeof cardValidator>;

const cardsValidator = z.object({
  normal: z.array(cardValidator),
  japan: z.array(cardValidator),
  mystic: z.array(cardValidator),
  "summer-2022": z.array(cardValidator),
});
export type Cards = z.infer<typeof cardsValidator>;

// Item
const itemValidator = z.object({
  item: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    rarity: z.enum(["Rare", "Epic", "Common", "Mystic"]),
    description: z.string().min(1),
    imageUrl: z.string().url(),
  }),
  // other properties are not used
});
export type Item = z.infer<typeof itemValidator>;
export type Items = {
  _items: Item[];
};

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

// User
const userValidator = z.object({
  userID: z.string().uuid(),
  name: z.string().min(1).max(50),
  rank: RankEnum,
  tier: z.number().min(0),
  topRank: z.number().min(1),
  vstar: z.number().min(0),
  avatar: z.string().nullable(),
});

export type User = z.infer<typeof userValidator>;

// Leaderboard
const leaderboardValidator = z.object({
  _items: z.array(userValidator),
});

export type Leaderboard = z.infer<typeof leaderboardValidator>;

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
  charms: partsValidator,
});
const fightersValidator = z.tuple([
  fighterValidator,
  fighterValidator,
  fighterValidator,
]);
export type Fighter = z.infer<typeof fighterValidator>;
export type Fighters = z.infer<typeof fightersValidator>;
export type FighterWithParts = Fighter & { parts: AxieParts };

// Battles
const battleValidator = z.object({
  battle_uuid: z.string().uuid(),
  client_ids: z.tuple([userIDValidator, userIDValidator]),
  team_ids: z.tuple([z.number().min(1), z.number().min(1)]),
  created_at: z.number().min(0),
  winner: z.number().min(0).max(1),
  battle_type: z.number().min(0),
  battle_type_string: z.enum(["pve", "pvp", "ranked_pvp"]),
  chimera_party_id: z.string().optional(),
  first_client_fighters: fightersValidator,
  second_client_fighters: fightersValidator,
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
