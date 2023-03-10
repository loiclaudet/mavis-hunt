import type { Item } from "lib/validators";

export type Rune = Item["item"];
export type RuneId = string;
export type ImageName = string;

export function getRuneDataFromRuneID(
  runeId: RuneId,
  runes: Rune[]
): Rune | null {
  return runes.find((rune) => rune.id.startsWith(runeId)) ?? null;
}
