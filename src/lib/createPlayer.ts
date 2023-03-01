import { AxieGene, HexType } from "agp-npm";
import { getCards } from "data/cards";
import type { Charm } from "./charms";
import { getCharmDataFromCharmGameID } from "./charms";
import { PROFILE_PLAYER_BATTLES } from "./consts";
import type { Rune } from "./runes";
import { getRuneDataFromRuneID } from "./runes";
import {
  isStarterAxie,
  partTypes,
  setStarterFighterGenes as setStarterFighterParts,
} from "./starterAxies";
import type {
  Battle,
  Fighters,
  FighterWithPartsAndItems,
  AxieParts,
  User,
  Fighter,
} from "./validators";

export function createPlayer({
  battles,
  user,
  runes,
  charms,
}: {
  battles: Battle[];
  user: User;
  runes: Rune[];
  charms: Charm[];
}) {
  const rankedPVPBattles: Battle[] = battles.filter(
    (battle) => battle.battle_type_string === "ranked_pvp"
  );

  const lastBattle = rankedPVPBattles[0];
  if (!lastBattle) {
    return {
      ...user,
      winRate: 0,
      winStreak: 0,
      battles: [],
      team: [],
    };
  }
  const isLastGameFirstFighters = lastBattle.client_ids[0] === user.userID;
  const axiesTeam: Fighters = isLastGameFirstFighters
    ? lastBattle.first_client_fighters
    : lastBattle.second_client_fighters;

  const axiesTeamsWithParts = axiesTeam.map((fighter) => {
    const fighterWithPartsAndItems: FighterWithPartsAndItems = {
      ...parseFighterItems({ fighter, runes, charms }),
    };
    // straters genes cannot be decoded
    if (isStarterAxie(fighter.axie_type)) {
      return setStarterFighterParts(fighterWithPartsAndItems);
    }
    let axieGene!: AxieGene;
    try {
      axieGene = new AxieGene(fighter.gene, HexType.Bit512);
    } catch (error) {
      console.error(error);
      throw new Error(
        `Axie gene ${fighter.gene} cannot be decoded for axie with id '${fighter.axie_id}',with type '${fighter.axie_type}'`
      );
    }
    if (!axieGene) {
      throw new Error(
        `Axie gene ${fighter.gene} cannot be decoded for axie with id '${fighter.axie_id}',with type '${fighter.axie_type}'`
      );
    }
    partTypes.forEach((partType) => {
      const partIdFromGene = axieGene[partType]?.d?.partId;
      const card = getCards().find((card) => card.partId === partIdFromGene);
      if (!card?.partId) {
        throw Error(
          `Part ${partType} with partId '${partIdFromGene}' not found for axie ${fighter.axie_id}`
        );
      }
      fighterWithPartsAndItems.parts[partType] = card.partId;
    });
    return fighterWithPartsAndItems;
  });

  let totalWon = 0;
  let winStreak = 0;
  let isStreakBroken = false;

  for (const battle of rankedPVPBattles) {
    const isFirstFighters = battle.client_ids[0] === user.userID;
    const won = isFirstFighters ? battle.winner === 0 : battle.winner === 1;
    if (won) {
      totalWon += 1;
    } else {
      isStreakBroken = true;
    }

    if (won && !isStreakBroken) {
      winStreak += 1;
    }
  }

  const winRate = totalWon / rankedPVPBattles.length;
  return {
    ...user,
    battles: rankedPVPBattles.slice(
      0,
      Math.min(PROFILE_PLAYER_BATTLES, rankedPVPBattles.length)
    ),
    team: axiesTeamsWithParts,
    winStreak,
    winRate,
  };
}

export type Player = ReturnType<typeof createPlayer> & {
  channel?: {
    live: boolean;
    name: string;
    title: string;
  };
};

export function parseFighterItems({
  fighter,
  runes,
  charms,
}: {
  fighter: Fighter;
  runes: Rune[];
  charms: Charm[];
}): FighterWithPartsAndItems {
  return {
    ...fighter,
    parts: {} as AxieParts,
    runes: fighter.runes
      .map((runeID) => {
        const runeData = getRuneDataFromRuneID(runeID, runes) ?? null;
        if (!runeData) {
          console.warn(
            `Rune with id '${runeID}' not found for axie with id '${fighter.axie_id}'`
          );
        }
        return runeData;
      })
      .filter(Boolean) as Rune[],
    charms: {
      eyes: getCharmDataFromCharmGameID(fighter.charms.eyes, charms),
      mouth: getCharmDataFromCharmGameID(fighter.charms.mouth, charms),
      ears: getCharmDataFromCharmGameID(fighter.charms.ears, charms),
      horn: getCharmDataFromCharmGameID(fighter.charms.horn, charms),
      back: getCharmDataFromCharmGameID(fighter.charms.back, charms),
      tail: getCharmDataFromCharmGameID(fighter.charms.tail, charms),
    },
  };
}
