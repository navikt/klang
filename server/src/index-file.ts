import { readFileSync } from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { frontendDistDirectoryPath } from '@app/config/config';
import { ENVIRONMENT, isDeployedToDev, isDeployedToProd } from '@app/config/env';
import { VERSION } from '@app/config/version';
import { INDEX_FILE_STATUSES, type IndexFileStatus } from '@app/index-file-status';
import { getLogger } from '@app/logger';
import { fetchDecoratorHtml } from '@app/nav-dekoratoren/nav-dekoratoren';
import type { DecoratorEnvProps } from '@app/nav-dekoratoren/types';
import { EmojiIcons, sendToSlack } from '@app/slack';

const log = getLogger('index-file');

export type { IndexFileStatus } from '@app/index-file-status';

type IndexFiles = ReadonlyMap<IndexFileStatus, string>;

class IndexFile {
  private readonly INDEX_TEMPLATE = readFileSync(path.join(frontendDistDirectoryPath, 'index.html'), 'utf-8');

  #isReady = false;

  public get isReady() {
    return this.#isReady;
  }

  #indexFiles: IndexFiles = new Map();

  /** The pre-made index HTML for the given status. */
  public getIndexFile(statusCode: IndexFileStatus): string {
    return this.#indexFiles.get(statusCode) ?? '';
  }

  constructor() {
    this.generateFile();
    setInterval(this.generateFile, 60 * 1000);
  }

  private getEnv = (): DecoratorEnvProps => {
    if (isDeployedToProd) {
      return { env: 'prod', serviceDiscovery: true };
    }

    return { env: 'dev', serviceDiscovery: isDeployedToDev };
  };

  private generateFile = async (): Promise<void> => {
    try {
      const start = performance.now();

      const { DECORATOR_SCRIPTS, DECORATOR_STYLES, DECORATOR_HEADER, DECORATOR_FOOTER } = await fetchDecoratorHtml({
        ...this.getEnv(),
        params: {
          simple: true,
          chatbot: true,
          redirectToApp: true,
          logoutUrl: '/oauth2/logout',
          context: 'privatperson',
          level: 'Level4',
          logoutWarning: true,
        },
      });

      const end = performance.now();

      const indexHtml = this.INDEX_TEMPLATE.replace('<decorator-scripts />', DECORATOR_SCRIPTS)
        .replace('<decorator-styles />', DECORATOR_STYLES)
        .replace('<decorator-header />', DECORATOR_HEADER)
        .replace('<decorator-footer />', DECORATOR_FOOTER)
        .replace('{{ENVIRONMENT}}', ENVIRONMENT)
        .replace('{{VERSION}}', VERSION);

      this.#indexFiles = new Map(
        INDEX_FILE_STATUSES.map((status): [IndexFileStatus, string] => [status, setStatus(indexHtml, status)]),
      );

      this.#isReady = true;

      log.debug({
        msg: 'Successfully updated index.html with Dekoratøren and variables.',
        data: { responseTime: Math.round(end - start) },
      });
    } catch (error) {
      log.error({ error, msg: 'Failed to update index.html with Dekoratøren and variables' });
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      sendToSlack(`Error when generating index file: ${errorMessage}`, EmojiIcons.Scream);
    }
  };
}

const setStatus = (html: string, statusCode: IndexFileStatus): string =>
  html.replace('{{STATUS}}', typeof statusCode === 'number' ? statusCode.toString(10) : statusCode);

export const indexFile = new IndexFile();
