import { getLogger } from '@app/logger/logger';

const log = getLogger('parse-json');

export const parseJSON = <T>(json: string): T | null => {
  try {
    return JSON.parse(json);
  } catch (error) {
    log.warn({ message: 'Failed to parse JSON', data: json, error });

    return null;
  }
};
