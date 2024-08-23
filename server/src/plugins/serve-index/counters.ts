import { proxyRegister } from '@app/prometheus/types';
import { Counter } from 'prom-client';

const viewCountLabels = ['url', 'has_saksnummer', 'redirected_from', 'referrer'] as const;

export const viewCountCounter = new Counter({
  name: 'view_count',
  help: 'Number of views.',
  labelNames: viewCountLabels,
  registers: [proxyRegister],
});

const externalRedirectLabels = ['url', 'has_saksnummer', 'redirected_from', 'referrer'] as const;

export const externalRedirectCounter = new Counter({
  name: 'external_redirect',
  help: 'Number of redirects to nav.no/klage.',
  labelNames: externalRedirectLabels,
  registers: [proxyRegister],
});
