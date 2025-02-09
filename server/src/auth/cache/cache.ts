import { createHash } from 'node:crypto';
import { OboMemoryCache } from '@app/auth/cache/memory-cache';
import { OboValkeyCache } from '@app/auth/cache/persistent-cache';
import { optionalEnvString } from '@app/config/env-var';

const VALKEY_URI = optionalEnvString('REDIS_URI_OBO_CACHE_KLANG');
const VALKEY_USERNAME = optionalEnvString('REDIS_USERNAME_OBO_CACHE_KLANG');
const VALKEY_PASSWORD = optionalEnvString('REDIS_PASSWORD_OBO_CACHE_KLANG');

class OboTieredCache {
  #oboPersistentCache: OboValkeyCache;
  #oboMemoryCache: OboMemoryCache | null = null;
  #isReady = false;

  constructor(valkeyUri: string, valkeyUsername: string, valkeyPassword: string) {
    this.#oboPersistentCache = new OboValkeyCache(valkeyUri, valkeyUsername, valkeyPassword);
    this.#init();
  }

  async #init() {
    await this.#oboPersistentCache.init();
    const allTokenMessages = await this.#oboPersistentCache.getAll();
    const oboMemoryCache = new OboMemoryCache(allTokenMessages);
    this.#oboMemoryCache = oboMemoryCache;
    this.#oboPersistentCache.addTokenListener(({ key, token, expiresAt }) => oboMemoryCache.set(key, token, expiresAt));
    this.#isReady = true;
  }

  public async get(key: string): Promise<string | null> {
    if (this.#oboMemoryCache === null) {
      return null;
    }

    const memoryHit = this.#oboMemoryCache.get(key);

    if (memoryHit !== null) {
      return memoryHit.token;
    }

    const redisHit = await this.#oboPersistentCache.get(key);

    if (redisHit !== null) {
      this.#oboMemoryCache.set(key, redisHit.token, redisHit.expiresAt);

      return redisHit.token;
    }

    return null;
  }

  public getCached(key: string): string | null {
    if (this.#oboMemoryCache === null) {
      return null;
    }

    const memoryHit = this.#oboMemoryCache.get(key);

    return memoryHit?.token ?? null;
  }

  public async set(key: string, token: string, expiresAt: number): Promise<void> {
    this.#oboMemoryCache?.set(key, token, expiresAt);
    await this.#oboPersistentCache.set(key, token, expiresAt);
  }

  public get isReady(): boolean {
    return this.#isReady && this.#oboPersistentCache.isReady;
  }
}

class OboSimpleCache {
  #oboMemoryCache = new OboMemoryCache([]);

  public get(key: string): string | null {
    const memoryHit = this.#oboMemoryCache.get(key);

    return memoryHit?.token ?? null;
  }

  public getCached = this.get;

  public async set(key: string, token: string, expiresAt: number): Promise<void> {
    this.#oboMemoryCache.set(key, token, expiresAt);
  }

  public get isReady(): boolean {
    return true;
  }
}

const hasRedis = VALKEY_URI !== undefined && VALKEY_USERNAME !== undefined && VALKEY_PASSWORD !== undefined;

export const oboCache = hasRedis
  ? new OboTieredCache(VALKEY_URI, VALKEY_USERNAME, VALKEY_PASSWORD)
  : new OboSimpleCache();

export const getCacheKey = (accessToken: string, appName: string) => `${hash(accessToken)}-${appName}`;

const hash = (str: string) => createHash('sha256').update(str).digest('hex');
