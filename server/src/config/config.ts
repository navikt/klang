import path from 'node:path';
import { requiredEnvNumber, requiredEnvString } from '@app/config/env-var';

const KLAGE_DITTNAV_API = 'klage-dittnav-api';
export const KLAGE_KODEVERK_API = 'klage-kodeverk-api';
const KLAGE_UNLEASH_PROXY = 'klage-unleash-proxy';

export const API_CLIENT_IDS = [KLAGE_DITTNAV_API, KLAGE_KODEVERK_API, KLAGE_UNLEASH_PROXY];

const cwd = process.cwd(); // This will be the server folder, as long as the paths in the NPM scripts are not changed.
const serverDirectoryPath = cwd;
const frontendDirectoryPath = path.resolve(serverDirectoryPath, '../frontend');
export const frontendDistDirectoryPath = path.resolve(frontendDirectoryPath, './dist');

export const NAIS_CLUSTER_NAME = requiredEnvString('NAIS_CLUSTER_NAME');

const isLocal = NAIS_CLUSTER_NAME === 'local';

const defaultValue = isLocal ? 'local' : undefined;

export const PROXY_VERSION = requiredEnvString('VERSION', defaultValue);
export const PORT = requiredEnvNumber('PORT', 8080);
