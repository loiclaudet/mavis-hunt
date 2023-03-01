import type { AxieParts, Item } from "lib/validators";

export type Charm = Item["item"];
export type CharmGameId = string;
export type ImageName = string;

export function getCharmDataFromCharmGameID(
  charmGameId: CharmGameId,
  charms: Charm[]
): Charm | null {
  if (!charmGameId) return null;

  const charm =
    charms.find((charm) => {
      return charm.id.startsWith(charmGameId);
    }) ?? null;
  return charm;
}

export function getCharmDataFromCharmImageUrl(
  charmImageUrl: string,
  charms: Charm[]
): Charm | null {
  const charm =
    charms.find((charm) => charm.imageUrl === charmImageUrl) ?? null;
  return charm;
}

export function getCharmImagesFromCharmPartsAndCharmGameId(
  partsAndCharms: AxieParts,
  charms: Charm[]
): (string | null)[] {
  const charmImageUrl = Object.values(partsAndCharms).map((part) => {
    const charm = getCharmDataFromCharmGameID(part, charms);
    if (charm) {
      return charm.imageUrl;
    }
    return null;
  });
  return charmImageUrl;
}
