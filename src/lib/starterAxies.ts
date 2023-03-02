import type { PartType } from "agp-npm/dist/models/part";
import type {
  AxieType,
  Fighter,
  FighterWithPartsAndItems,
} from "lib/validators";

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

export function setStarterFighterGenes(
  fighter: Fighter | Omit<FighterWithPartsAndItems, "parts">
):
  | FighterWithPartsAndItems
  | Omit<FighterWithPartsAndItems, "runes" | "charms"> {
  const fighterName = starterAxiesMap.get(Number(fighter.axie_id) as StarterId);
  if (!fighterName) {
    throw new Error(`No starter axie found for id ${fighter.axie_id}`);
  }

  (
    fighter as
      | FighterWithPartsAndItems
      | Omit<FighterWithPartsAndItems, "runes" | "charms">
  ).parts = {
    back: "",
    ears: "",
    eyes: "",
    horn: "",
    mouth: "",
    tail: "",
  };
  const starterFighter = fighter as
    | FighterWithPartsAndItems
    | Omit<FighterWithPartsAndItems, "runes" | "charms">;

  switch (fighterName) {
    case "buba":
      starterFighter.parts.back = "back-forest-hero";
      starterFighter.parts.ears = "ears-foxy";
      starterFighter.parts.eyes = "eyes-sparky";
      starterFighter.parts.horn = "horn-persimmon";
      starterFighter.parts.mouth = "mouth-foxy";
      starterFighter.parts.tail = "tail-buba-brush";
      break;
    case "olek":
      starterFighter.parts.back = "back-succulent";
      starterFighter.parts.ears = "ears-hidden-ears";
      starterFighter.parts.eyes = "eyes-risky-trunk";
      starterFighter.parts.horn = "horn-rusty-helm";
      starterFighter.parts.mouth = "mouth-beetroot";
      starterFighter.parts.tail = "tail-sprout";
      break;
    case "puffy":
      starterFighter.parts.back = "back-tiny-dino";
      starterFighter.parts.ears = "ears-little-crab";
      starterFighter.parts.eyes = "eyes-baby";
      starterFighter.parts.horn = "horn-jellytacle";
      starterFighter.parts.mouth = "mouth-puff";
      starterFighter.parts.tail = "tail-puff";
      break;
    case "ena":
      starterFighter.parts.back = "back-magic-sack";
      starterFighter.parts.ears = "ears-sakura";
      starterFighter.parts.eyes = "eyes-papi";
      starterFighter.parts.horn = "horn-mandarine";
      starterFighter.parts.mouth = "mouth-cub";
      starterFighter.parts.tail = "tail-aegis-talisman";
      break;
    case "tripp":
      starterFighter.parts.back = "back-goldfish";
      starterFighter.parts.ears = "ears-nut-cracker";
      starterFighter.parts.eyes = "eyes-zeal";
      starterFighter.parts.horn = "horn-cactus";
      starterFighter.parts.mouth = "mouth-nut-cracker";
      starterFighter.parts.tail = "tail-nut-cracker";
      break;
  }
  return starterFighter;
}
