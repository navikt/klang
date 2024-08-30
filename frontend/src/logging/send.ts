import { LogEvent } from '@app/logging/types';

const HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
};

export const send = async (data: LogEvent) => {
  if (import.meta.env.MODE === 'development') {
    // eslint-disable-next-line no-console
    console.debug('Sending log', data);

    return;
  }

  try {
    const res = await fetch('/frontend-log', {
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