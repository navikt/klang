import { errorEvent } from '@app/logging/logger';
import { useCallback, useEffect, useState } from 'react';

interface FeatureResponse {
  enabled: boolean;
}

const ENDPOINT = '/feature-toggle';
const POLL_INTERVAL_MS = 15_000;

export const useFeatureFlag = (flag: string) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const checkFeatureFlag = useCallback(async () => {
    try {
      const response = await fetch(`${ENDPOINT}/${flag}`, { method: 'GET' });

      if (response.ok) {
        const data: unknown = await response.json();

        if (isFeatureResponse(data)) {
          setIsEnabled(data.enabled);
        } else {
          errorEvent('Invalid feature flag response format');
        }
      }
    } catch {
      errorEvent('Failed to fetch feature flag status');
    }
  }, [flag]);

  useEffect(() => {
    checkFeatureFlag();

    const intervalId = setInterval(checkFeatureFlag, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [checkFeatureFlag]);

  return isEnabled;
};

const isFeatureResponse = (data: unknown): data is FeatureResponse =>
  data !== null && typeof data === 'object' && 'enabled' in data && typeof data.enabled === 'boolean';
