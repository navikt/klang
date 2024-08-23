export enum Level {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export enum FrontendEventTypes {
  NAVIGATION = 'navigation',
  APP = 'app',
  ERROR = 'error',
  API = 'api',
  SESSION = 'session',
}

export enum SessionAction {
  /** Load session case */
  LOAD = 'load',
  /** Create session case */
  CREATE = 'create',
  /** Load or create session case */
  LOAD_OR_CREATE = 'load-create',
  /** Delete session case */
  DELETE = 'delete',
  /** Set session case */
  SET = 'set',
  /** Update session case */
  UPDATE = 'update',
}
