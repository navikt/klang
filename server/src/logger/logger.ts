import { performance } from 'perf_hooks';
import { RequestHandler } from 'express';

const VERSION = process.env.VERSION ?? 'unknown';

const LOGGERS: Map<string, Logger> = new Map();

type SerializableValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | boolean[]
  | null
  | null[]
  | undefined
  | undefined[];

export interface SerializableObject {
  [key: string]: SerializableValue;
}

interface MessageLog {
  message: string;
  error?: Error | unknown;
  data?: SerializableValue | SerializableObject;
}

interface ErrorLog {
  message?: string;
  error: Error | unknown;
  data?: SerializableValue | SerializableObject;
}

type ServerLog = MessageLog | ErrorLog;

interface Logger {
  debug: (args: ServerLog) => void;
  info: (args: ServerLog) => void;
  warn: (args: ServerLog) => void;
  error: (args: ServerLog) => void;
}

interface Log extends SerializableObject {
  '@timestamp': string;
  version: string;
  module: string;
  message?: string;
  stacktrace?: string;
}

export enum Level {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export const getLogger = (moduleName: string): Logger => {
  const cachedLogger = LOGGERS.get(moduleName);

  if (cachedLogger !== undefined) {
    return cachedLogger;
  }

  const logger: Logger = {
    debug: (args) => console.debug(getLog(moduleName, Level.DEBUG, args)),
    info: (args) => console.info(getLog(moduleName, Level.INFO, args)),
    warn: (args) => console.warn(getLog(moduleName, Level.WARN, args)),
    error: (args) => console.warn(getLog(moduleName, Level.ERROR, args)),
  };

  LOGGERS.set(moduleName, logger);

  return logger;
};

const getLog = (module: string, level: Level, { message, error, data }: ServerLog) => {
  const log: Log = {
    level,
    '@timestamp': new Date().toISOString(),
    version: VERSION,
    module,
  };

  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      log.data = JSON.stringify(data, null, 2);
    } else {
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value !== 'object' && value !== null) {
          log[key] = value;
        } else {
          log[key] = JSON.stringify(value, null, 2);
        }
      });
    }
  } else {
    log.data = data;
  }

  if (error instanceof Error) {
    log.stacktrace = error.stack;
    log.message = typeof message === 'string' ? `${message} - ${error.name}: ${error.message}` : error.message;
  } else {
    log.message = message;
  }

  return JSON.stringify(log);
};

const httpLogger = getLogger('http');

export const httpLoggingMiddleware: RequestHandler = (req, res, next) => {
  const start = performance.now();

  res.once('finish', () => {
    const { method, url } = req;
    const referrer = req.header('referrer');
    const userAgent = req.header('user-agent');

    if (url.endsWith('/isAlive') || url.endsWith('/isReady')) {
      return;
    }

    const { statusCode } = res;

    const responseTime = Math.round(performance.now() - start);

    logHttpRequest({
      method,
      url,
      statusCode,
      referrer,
      userAgent,
      responseTime,
    });
  });

  next();
};

interface HttpData extends SerializableObject {
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  referrer?: string;
  userAgent?: string;
}

const logHttpRequest = (data: HttpData) => {
  const message = `${data.statusCode} ${data.method} ${data.url}`;

  if (data.statusCode >= 500) {
    httpLogger.error({ message, data });

    return;
  }

  if (data.statusCode >= 400) {
    httpLogger.warn({ message, data });

    return;
  }

  httpLogger.debug({ message, data });
};
