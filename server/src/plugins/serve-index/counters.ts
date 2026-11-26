import { proxyRegister } from '@app/prometheus/types';
import { Counter } from 'prom-client';

const viewCountLabels = ['url', 'has_saksnummer', 'redirected_from', 'referrer'] as const;

export const viewCountCounter = new Counter({
  name: 'view_count',
  help: 'Number of views.',
  labelNames: viewCountLabels,
  registers: [proxyRegister],
});

const notFoundLabels = ['url'] as const;

export const notFoundCounter = new Counter({
  name: 'not_found',
  help: 'Number of requests to unknown URLs, responded to with a 404 page.',
  labelNames: notFoundLabels,
  registers: [proxyRegister],
});
