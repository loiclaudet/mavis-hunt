import type { PartType } from "agp-npm/dist/models/part";
import type { AxieType, Fighter, FighterWithParts } from "lib/validators";

export type StarterName =
  | "olek"
  | "buba"
  | "puffy"
  | "ena"
  | "tripp"
  | "velora"
  | "aaron"
  | "venoki"
  | "rosh"
  | "heero"
  | "momo"
  | "kit";
export type StarterId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 12 | 13 | 16;
export const starterAxiesMap = new Map<StarterId, StarterName>([
  [1, "buba"],
  [2, "olek"],
  [3, "puffy"],
  [4, "velora"],
  [5, "tripp"],
  [6, "aaron"],
  [7, "venoki"],
  [8, "rosh"],
  [9, "heero"],
  [12, "momo"],
  [13, "kit"],
  [16, "ena"],
]);

export function isStarterAxie(axieType: AxieType): boolean {
  return axieType === "starter" || Number(axieType) === 0;
}

export const partTypes = [
  "eyes",
  "mouth",
  "ears",
  "horn",
  "back",
  "tail",
] as PartType[];

export function setStarterFighterGenes(fighter: FighterWithParts): Fighter {
  const fighterName = starterAxiesMap.get(Number(fighter.axie_id) as StarterId);
  if (!fighterName) {
    throw new Error(`No starter axie found for id ${fighter.axie_id}`);
  }

  switch (fighterName) {
    case "buba":
      fighter.parts.back = "back-forest-hero";
      fighter.parts.ears = "ears-foxy";
      fighter.parts.eyes = "eyes-sparky";
      fighter.parts.horn = "horn-persimmon";
      fighter.parts.mouth = "mouth-foxy";
      fighter.parts.tail = "tail-buba-brush";
      break;
    case "olek":
      fighter.parts.back = "back-succulent";
      fighter.parts.ears = "ears-hidden-ears";
      fighter.parts.eyes = "eyes-risky-trunk";
      fighter.parts.horn = "horn-rusty-helm";
      fighter.parts.mouth = "mouth-beetroot";
      fighter.parts.tail = "tail-sprout";
      break;
    case "puffy":
      fighter.parts.back = "back-tiny-dino";
      fighter.parts.ears = "ears-little-crab";
      fighter.parts.eyes = "eyes-baby";
      fighter.parts.horn = "horn-jellytacle";
      fighter.parts.mouth = "mouth-puff";
      fighter.parts.tail = "tail-puff";
      break;
    case "ena":
      fighter.parts.back = "back-magic-sack";
      fighter.parts.ears = "ears-sakura";
      fighter.parts.eyes = "eyes-papi";
      fighter.parts.horn = "horn-mandarine";
      fighter.parts.mouth = "mouth-cub";
      fighter.parts.tail = "tail-aegis-talisman";
      break;
    case "tripp":
      fighter.parts.back = "back-goldfish";
      fighter.parts.ears = "ears-nut-cracker";
      fighter.parts.eyes = "eyes-zeal";
      fighter.parts.horn = "horn-cactus";
      fighter.parts.mouth = "mouth-nut-cracker";
      fighter.parts.tail = "tail-nut-cracker";
      break;
  }
  return fighter;
}
