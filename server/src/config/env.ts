import { NAIS_CLUSTER_NAME, PORT } from '@app/config/config';
import { requiredEnvString } from './env-var';

const getEnvironmentVersion = <T>(local: T, development: T, production: T): T => {
  if (isDeployedToDev) {
    return development;
  }

  if (isDeployedToProd) {
    return production;
  }

  return local;
};

export const isDeployedToDev = NAIS_CLUSTER_NAME === 'dev-gcp';
export const isDeployedToProd = NAIS_CLUSTER_NAME === 'prod-gcp';
export const isDeployed = isDeployedToDev || isDeployedToProd;
export const isLocal = !isDeployed;

export const ENVIRONMENT = getEnvironmentVersion('local-bff', 'development', 'production');

const LOCAL_DOMAIN = `localhost:${PORT}`;
const LOCAL_URL = `http://${LOCAL_DOMAIN}`;

export const DEV_DOMAIN = 'klage.intern.dev.nav.no';
export const DEV_URL = `https://${DEV_DOMAIN}`;

const PROD_DOMAIN = 'klage.intern.nav.no';
const PROD_URL = `https://${PROD_DOMAIN}`;

export const URL: string = getEnvironmentVersion(LOCAL_URL, DEV_URL, PROD_URL);

export const NAIS_NAMESPACE = requiredEnvString('NAIS_NAMESPACE', 'none');

export const POD_NAME = requiredEnvString('OTEL_RESOURCE_ATTRIBUTES_POD_NAME', 'none');

export const YTELSE_OVERVIEW_URL = isDeployedToProd
  ? 'https://www.nav.no/klage'
  : 'https://www.ekstern.dev.nav.no/klage';
