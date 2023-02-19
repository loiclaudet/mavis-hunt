export function replaceBracesAndBracketsWithTags(text: string): string {
  return text
    .replaceAll(/\<(.*?)\>/g, "<span>$1</span>") // replace order matters because of the caret
    .replaceAll(/{(.*?)}/g, "<span>$1</span>")
    .replaceAll(/\[(.*?)\]/g, "<span>$1</span>");
}
