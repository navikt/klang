import { TOKEN_X_CLIENT_ID, TOKEN_X_PRIVATE_JWK, TOKEN_X_WELL_KNOWN_URL } from '@app/config/config';
import { isLocal } from '@app/config/env';
import { getLogger } from '@app/logger';
import { type BaseClient, Issuer } from 'openid-client';

const log = getLogger('auth');

let tokenXInstance: BaseClient | null = null;

export const getTokenXClient = async (retries = 3): Promise<BaseClient> => {
  if (tokenXInstance !== null) {
    return tokenXInstance;
  }

  try {
    const issuer = await Issuer.discover(TOKEN_X_WELL_KNOWN_URL);

    const keys = [TOKEN_X_PRIVATE_JWK];

    tokenXInstance = new issuer.Client(
      { client_id: TOKEN_X_CLIENT_ID, token_endpoint_auth_method: 'private_key_jwt' },
      { keys },
    );

    return tokenXInstance;
  } catch (error) {
    if (retries !== 0) {
      const triesRemaining = retries - 1;
      log.warn({ msg: `Retrying to get Token X client. ${triesRemaining} tries remaining...` });
      tokenXInstance = null;

      return getTokenXClient(triesRemaining);
    }

    log.error({ error, msg: 'Failed to get Token X client' });
    throw error;
  }
};

export const getIsTokenXClientReady = () => isLocal || tokenXInstance !== null;
