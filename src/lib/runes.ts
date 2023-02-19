import type { Item } from "lib/validators";

export type Rune = Item["item"];
export type RuneId = string;
export type ImageName = string;

export function getRuneDataFromRuneId(
  runeId: RuneId,
  runes: Rune[]
): Rune | null {
  return runes.find((rune) => rune.id.startsWith(runeId)) ?? null;
}

export function getRuneDataFromRuneImageUrl(
  runeImageUrl: string,
  runes: Rune[]
): Rune | null {
  const rune = runes.find((rune) => rune.imageUrl === runeImageUrl) ?? null;
  return rune;
}

export function getRunesImagesFromRunesGameIds(
  runeIds: RuneId[],
  runes: Rune[]
): (string | null)[] {
  return runeIds.map((runeId) => {
    const rune = getRuneDataFromRuneId(runeId, runes);
    if (rune) {
      return rune.imageUrl;
    }
    return null;
  });
}
