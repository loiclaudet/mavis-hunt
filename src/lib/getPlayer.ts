import { AxieGene, HexType } from "agp-npm";
import { getCards } from "data/cards";
import { PROFILE_PLAYER_BATTLES } from "./consts";
import {
  isStarterAxie,
  partTypes,
  setStarterFighterGenes as setStarterFighterParts,
} from "./starterAxies";
import type {
  Battle,
  Fighters,
  FighterWithParts,
  AxieParts,
  User,
} from "./validators";

// TODO: refactor Axie and Player components to follow the island pattern
export function getPlayer({
  battles,
  player,
}: {
  battles: Battle[];
  player: User;
}) {
  const rankedPVPBattles: Battle[] = battles.filter(
    (battle) => battle.battle_type_string === "ranked_pvp"
  );

  const lastBattle = rankedPVPBattles[0];
  if (!lastBattle) {
    return {
      ...player,
      winRate: 0,
      winStreak: 0,
      battles: [],
      team: [],
    };
  }
  const isLastGameFirstFighters = lastBattle.client_ids[0] === player.userID;
  const axiesTeam: Fighters = isLastGameFirstFighters
    ? lastBattle.first_client_fighters
    : lastBattle.second_client_fighters;

  const axiesTeamsWithParts = axiesTeam.map((fighter) => {
    const fighterWithParts: FighterWithParts = {
      ...fighter,
      parts: {} as AxieParts,
    };
    // straters genes cannot be decoded
    if (isStarterAxie(fighter.axie_type)) {
      return setStarterFighterParts(fighterWithParts);
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
      fighterWithParts.parts[partType] = card.partId;
    });
    return fighterWithParts;
  }) as FighterWithParts[];

  let totalWon = 0;
  let winStreak = 0;
  let isStreakBroken = false;

  for (const battle of rankedPVPBattles) {
    const isFirstFighters = battle.client_ids[0] === player.userID;
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
    ...player,
    battles: rankedPVPBattles.slice(
      0,
      Math.min(PROFILE_PLAYER_BATTLES, rankedPVPBattles.length)
    ),
    team: axiesTeamsWithParts,
    winStreak,
    winRate,
  };
}

export type Player = ReturnType<typeof getPlayer> & {
  channel?: {
    live: boolean;
    name: string;
    title: string;
  };
};
