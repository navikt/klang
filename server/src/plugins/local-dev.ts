import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { DEV_URL, isLocal } from '@app/config/env';
import { getLogger } from '@app/logger';
import { Type, type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('local-dev-plugin');

const getMimeType = (filePath: string): string | undefined => {
  const extension = filePath.split('.').at(-1);

  switch (extension) {
    case 'css':
      return 'text/css';
    case 'js':
      return 'application/javascript';
    case 'woff2':
      return 'font/woff2';
    case 'woff':
      return 'font/woff';
    case 'html':
      return 'text/html';
    case 'json':
      return 'application/json';
    case 'png':
      return 'image/png';
    case 'svg':
      return 'image/svg+xml';
    case 'ico':
      return 'image/x-icon';
    case 'txt':
      return 'text/plain';
    default:
      return undefined;
  }
};

interface FileEntry {
  data: Buffer;
  mimeType: string;
}

export const LOCAL_DEV_PLUGIN_ID = 'local-dev';

export const localDevPlugin = fastifyPlugin(
  async (app) => {
    // Serve assets only in local environment. In production and dev, assets are served by the CDN.
    if (!isLocal) {
      return;
    }

    app
      .withTypeProvider<TypeBoxTypeProvider>()
      .get(
        '/oauth2/:endpoint',
        { schema: { params: Type.Object({ endpoint: Type.String() }) } },
        async (req, reply) => {
          const { endpoint } = req.params;

          const res = await fetch(`${DEV_URL}/oauth2/${endpoint}`, {
            headers: { ...req.headers, host: DEV_URL },
            method: req.method,
          });

          return reply.send(res);
        },
      );

    app.post('/collect', async (_, reply) => {
      log.info({ msg: 'Collect' });

      return reply.status(200).send();
    });

    const ASSETS_FOLDER = '../frontend/dist/assets';

    const files: Map<string, FileEntry> = new Map();

    for (const fileName of readdirSync(ASSETS_FOLDER)) {
      const filePath = `${ASSETS_FOLDER}/${fileName}`;

      if (existsSync(filePath)) {
        const fileKey = `/assets/${fileName}`;
        const data = readFileSync(filePath);
        const mimeType = getMimeType(filePath);

        if (mimeType === undefined) {
          log.warn({ msg: `Unknown MIME type for asset file "${fileName}"`, data: { path: filePath } });
        }

        files.set(fileKey, { data, mimeType: mimeType ?? 'text/plain' });
      }
    }

    app.get('/assets/*', async (req, res) => {
      const fileEntry = files.get(req.url);

      if (fileEntry === undefined) {
        log.warn({ msg: 'File not found', data: { path: req.url } });
        res.header('content-type', 'text/plain').status(404);

        return res.send('Not Found');
      }

      const { data, mimeType } = fileEntry;

      return res.header('content-type', mimeType).status(200).send(data);
    });
  },
  { fastify: '5', name: LOCAL_DEV_PLUGIN_ID },
);
