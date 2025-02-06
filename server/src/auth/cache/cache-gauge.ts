import { proxyRegister } from '@app/prometheus/types';
import { Counter, Gauge, Histogram } from 'prom-client';

const labelNames = ['hit'] as const;

export const persistentCacheGauge = new Counter({
  name: 'obo_persistent_cache',
  help: 'Number of requests to the persistent OBO cache. "hit" is the type of hit: "miss", "invalid", "hit" or "expired".',
  labelNames,
  registers: [proxyRegister],
});

export const persistentCacheSizeGauge = new Gauge({
  name: 'obo_persistent_cache_size',
  help: 'Number of OBO tokens in the persistent cache.',
  registers: [proxyRegister],
});

export const memoryCacheGauge = new Counter({
  name: 'obo_cache',
  help: 'Number of requests to the OBO cache. "hit" is the type of hit: "miss", "persistent", "hit", or "expired".',
  labelNames,
  registers: [proxyRegister],
});

export const memoryCacheSizeGauge = new Gauge({
  name: 'obo_cache_size',
  help: 'Number of OBO tokens in the cache.',
  registers: [proxyRegister],
});

export const oboRequestDuration = new Histogram({
  name: 'obo_request_duration',
  help: 'Duration of OBO token requests in milliseconds.',
  buckets: [0, 10, 100, 200, 300, 400, 500, 600, 800, 900, 1_000],
  registers: [proxyRegister],
});
