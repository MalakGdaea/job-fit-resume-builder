export function normalizeExternalUrl(url: string): string {
  const trimmedUrl = url.trim();

  if (/^(https?:|mailto:|tel:)/i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  return `https://${trimmedUrl}`;
}
