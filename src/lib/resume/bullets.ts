export function getDescriptionBulletItems(
  description: string,
  existingBullets: string[]
): string[] {
  return [
    ...splitDescriptionIntoBullets(description),
    ...existingBullets,
  ].filter(Boolean);
}

function splitDescriptionIntoBullets(description: string): string[] {
  const normalizedDescription = description.trim();

  if (!normalizedDescription) {
    return [];
  }

  const lineItems = normalizedDescription
    .split(/\r?\n/)
    .map((line) => stripBulletPrefix(line))
    .filter(Boolean);

  if (lineItems.length > 1) {
    return lineItems;
  }

  const sentenceItems = normalizedDescription
    .match(/[^.!?]+[.!?]?/g)
    ?.map((sentence) => stripBulletPrefix(sentence))
    .filter(Boolean);

  return sentenceItems && sentenceItems.length > 1
    ? sentenceItems
    : [normalizedDescription];
}

function stripBulletPrefix(value: string): string {
  return value.trim().replace(/^[-*]\s*/, "").trim();
}
