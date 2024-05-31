import { Request, Router, json } from 'express';
import { Level, SerializableObject, getLogger } from '@app/logger/logger';
import { FrontendEventTypes, FrontendLogEvent } from '@app/logger/types';

const router = Router();

const log = getLogger('frontend-log');

export const frontendLog = () => {
  router.post('/frontend-log', json(), (req: Request<never, never, SerializableObject>, res) => {
    if (!isFrontendLog(req.body)) {
      return res.status(400).send();
    }

    const { level, message, ...data } = req.body;

    log[level]({ message, data });

    res.status(200).send();
  });

  return router;
};

const LOG_LEVELS = Object.values(Level);
const EVENT_TYPES = Object.values(FrontendEventTypes);

const isFrontendLog = (data: unknown): data is FrontendLogEvent => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  return (
    'level' in data &&
    typeof data.level === 'string' &&
    LOG_LEVELS.some((level) => level === data.level) &&
    'type' in data &&
    typeof data.type === 'string' &&
    EVENT_TYPES.some((type) => type === data.type)
  );
};
