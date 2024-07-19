import compression, { filter } from 'compression';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { DOMAIN, isDeployed, isDeployedToProd } from './config/env';
import { init } from './init';
import { getLogger, httpLoggingMiddleware } from './logger/logger';
import { processErrors } from './process-errors';
import { metricsMiddleware } from './prometheus/middleware';
import { indexFile } from './routes/index-file';
import { EmojiIcons, sendToSlack } from './slack';

processErrors();

const log = getLogger('server');

if (isDeployed) {
  log.info({ message: 'Started!' });
  sendToSlack('Started!', EmojiIcons.StartStruck);
}

const server = express();

// Add the prometheus middleware to all routes
server.use(metricsMiddleware);

server.use(httpLoggingMiddleware);

server.set('trust proxy', true);
server.disable('x-powered-by');

const shouldCompress = (req: Request, res: Response) => {
  if (res.get('Content-Type') === 'text/event-stream' || req.path.endsWith('.map')) {
    return false;
  }

  return filter(req, res);
};

server.use(compression({ filter: shouldCompress }));

server.use((_: Request, res: Response, next: NextFunction) => {
  res.header('X-Frame-Options', 'SAMEORIGIN');
  res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('Referrer-Policy', 'no-referrer-when-downgrade');
  next();
});

server.use(
  cors({
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: [
      'Accept-Language',
      'Accept',
      'Cache-Control',
      'Connection',
      'Content-Type',
      'Cookie',
      'DNT',
      'Host',
      'Origin',
      'Pragma',
      'Referer',
      'Sec-Fetch-Dest',
      'Sec-Fetch-Mode',
      'Sec-Fetch-Site',
      'User-Agent',
      'X-Forwarded-For',
      'X-Forwarded-Host',
      'X-Forwarded-Proto',
      'X-Requested-With',
    ],
    origin: isDeployedToProd ? DOMAIN : [DOMAIN, /https?:\/\/localhost:\d{4,}/],
  }),
);

server.get('/isAlive', (_, res) => res.status(200).send('Alive'));
server.get('/isReady', (_, res) =>
  res.status(indexFile.isReady ? 200 : 418).send(indexFile.isReady ? 'Ready' : 'Not ready'),
);

init(server);
