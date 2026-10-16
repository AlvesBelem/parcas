const HTTP_PROTOCOLS = new Set(["http:", "https:"]);

export function getSafeExternalUrl(value: string | null | undefined): URL | null {
  if (!value) return null;

  try {
    const url = new URL(value.trim());
    if (!HTTP_PROTOCOLS.has(url.protocol) || !url.hostname || url.username || url.password) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

export function isSafeExternalUrl(value: string) {
  return getSafeExternalUrl(value) !== null;
}

export function isSafeImageSource(value: string) {
  const source = value.trim();

  if (source.startsWith("/")) {
    return !source.startsWith("//") && !source.includes("\\");
  }

  const url = getSafeExternalUrl(source);
  return url?.protocol === "https:";
}
