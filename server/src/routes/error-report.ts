import { Request, Router, json } from 'express';
import { SerializableObject, getLogger } from '@app/logger/logger';

const router = Router();

const log = getLogger('frontend-error-reporter');

export const errorReporter = () => {
  router.post('/error-report', json(), (req: Request<never, never, SerializableObject>, res) => {
    log.warn({ message: 'Error report', data: req.body });
    res.status(200).send();
  });

  return router;
};
