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
export const isTest = process.env.NODE_ENV === 'test';

export const NAIS_APP_NAME = requiredEnvString('NAIS_APP_NAME', isTest ? '' : undefined);
export const NAIS_POD_NAME = requiredEnvString('NAIS_POD_NAME', isTest ? '' : undefined);

export const ENVIRONMENT = getEnvironmentVersion('local', 'development', 'production');

const LOCAL_DOMAIN = `localhost:${PORT}`;
const LOCAL_URL = `http://${LOCAL_DOMAIN}`;

export const DEV_DOMAIN = 'klage.intern.dev.nav.no';
export const DEV_URL = `https://${DEV_DOMAIN}`;

const PROD_DOMAIN = 'klage.intern.nav.no';
const PROD_URL = `https://${PROD_DOMAIN}`;

export const URL: string = getEnvironmentVersion(LOCAL_URL, DEV_URL, PROD_URL);

export const NAIS_NAMESPACE = requiredEnvString('NAIS_NAMESPACE', 'none');

export const POD_NAME = requiredEnvString('OTEL_RESOURCE_ATTRIBUTES_POD_NAME', 'none');

export const NAV_KLAGE_URL_PROD = 'https://www.nav.no/klage';
export const NAV_KLAGE_URL_DEV = 'https://www.ekstern.dev.nav.no/klage';

export const TEAM_LOG_PARAMS = {
  google_cloud_project: requiredEnvString('GOOGLE_CLOUD_PROJECT', isTest ? '' : undefined),
  nais_namespace_name: requiredEnvString('NAIS_NAMESPACE', isTest ? '' : undefined),
  nais_pod_name: NAIS_POD_NAME,
  nais_container_name: NAIS_APP_NAME,
};
