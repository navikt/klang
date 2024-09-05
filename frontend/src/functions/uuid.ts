const SUPPORTS_CRYPTO =
  'crypto' in window &&
  typeof window.crypto === 'object' &&
  window.crypto !== null &&
  'getRandomValues' in window.crypto &&
  // biome-ignore lint/complexity/useLiteralKeys: Not typed in TS
  typeof window.crypto['getRandomValues'] === 'function';

const getRandomSegment = (): string => Math.random().toString(36).substring(2);

const fallbackUuidGenerator = (): `${string}-${string}` => {
  const now = new Date().getTime();

  return `${now}-${getRandomSegment()}-${getRandomSegment()}-${getRandomSegment()}`;
};

export const getUniqueId = SUPPORTS_CRYPTO ? () => window.crypto.randomUUID() : () => fallbackUuidGenerator();
