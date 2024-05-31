import { getLogger } from './logger/logger';
import { EmojiIcons, sendToSlack } from './slack';

const log = getLogger('');

export const processErrors = () => {
  process
    .on('unhandledRejection', (reason, promise) => {
      log.error({ error: reason, message: `Process ${process.pid} received a unhandledRejection signal` });

      promise.catch((error: unknown) => log.error({ error, message: `Uncaught error` }));
    })
    .on('uncaughtException', (error) =>
      log.error({ error, message: `Process ${process.pid} received a uncaughtException signal` }),
    )
    .on('SIGTERM', (signal) => {
      log.info({ message: `Process ${process.pid} received a ${signal} signal.` });
      process.exit(0);
    })
    .on('SIGINT', (signal) => {
      const error = new Error(`Process ${process.pid} has been interrupted, ${signal}.`);
      log.error({ error });
      process.exit(1);
    })
    .on('beforeExit', async (code) => {
      const message = `Crash ${JSON.stringify(code)}`;
      log.error({ message });
      sendToSlack(message, EmojiIcons.Scream);
    });
};
