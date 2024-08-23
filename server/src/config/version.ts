import { isDeployed } from '@app/config/env';
import { requiredEnvString } from '@app/config/env-var';

const getDefaultVersion = () => {
  if (isDeployed) {
    return undefined;
  }

  return 'local';
};

export const VERSION = requiredEnvString('VERSION', getDefaultVersion());
