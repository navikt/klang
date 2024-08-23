import path from 'node:path';
import { requiredEnvJson, requiredEnvNumber, requiredEnvString } from '@app/config/env-var';
import type { JWK } from 'jose';

export const API_CLIENT_IDS = ['klage-dittnav-api', 'klage-kodeverk-api'];

const cwd = process.cwd(); // This will be the server folder, as long as the paths in the NPM scripts are not changed.
const serverDirectoryPath = cwd;
const frontendDirectoryPath = path.resolve(serverDirectoryPath, '../frontend');
export const frontendDistDirectoryPath = path.resolve(frontendDirectoryPath, './dist');

export const NAIS_CLUSTER_NAME = requiredEnvString('NAIS_CLUSTER_NAME');

const isLocal = NAIS_CLUSTER_NAME === 'local';

const defaultValue = isLocal ? 'local' : undefined;
const localJwk: JWK = {};

export const TOKEN_X_CLIENT_ID = requiredEnvString('TOKEN_X_CLIENT_ID', defaultValue);
export const TOKEN_X_WELL_KNOWN_URL = requiredEnvString('TOKEN_X_WELL_KNOWN_URL', defaultValue);
export const TOKEN_X_PRIVATE_JWK = requiredEnvJson<JWK>('TOKEN_X_PRIVATE_JWK', localJwk);
export const PROXY_VERSION = requiredEnvString('VERSION', defaultValue);
export const PORT = requiredEnvNumber('PORT', 8080);
