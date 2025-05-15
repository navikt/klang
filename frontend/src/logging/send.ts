import type { LogEvent } from '@app/logging/types';

const HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
};

export const send = async (data: LogEvent) => {
  if (import.meta.env.MODE === 'development') {
    console.debug('Sending log', data);

    return;
  }

  const endpoint = typeof data.user_id === 'string' ? '/frontend-team-log' : '/frontend-log';

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error('Error response sending logs', res);
    }
  } catch (e) {
    console.error('Failed to send logs', e);
  }
};
