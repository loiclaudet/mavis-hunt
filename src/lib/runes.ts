import type { Item } from "lib/validators";

export type Rune = Item["item"];
export type RuneId = string;
export type ImageName = string;

export function getRuneDataFromRuneID(
  runeId: RuneId,
  runes: Rune[]
): Rune | null {
  return (
    runes.find((rune) => {
      // temporary fix for s3 runes
      // TODO: remove this when s3 runes are added to the API call
      const runeIdWithS3 = rune.id.replace(/s\d_/i, "s3_");
      return runeIdWithS3.startsWith(runeId);
    }) ?? null
  );
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
    const rune = getRuneDataFromRuneID(runeId, runes);
    if (rune) {
      return rune.imageUrl;
    }
    return null;
  });
}
