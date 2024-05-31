import { Level } from '@app/logger/logger';

export enum FrontendEventTypes {
  NAVIGATION = 'navigation',
  APP = 'app',
  ERROR = 'error',
  API = 'api',
  SESSION = 'session',
}

interface BaseEventData {
  session_id: string;
  level: Level;
  /** Current client Unix timestamp in milliseconds. */
  client_timestamp: number;
  /** Milliseconds until the token expires. */
  token_expires?: number;
  /** If the user is logged in. */
  is_logged_in: boolean;
  /** Current client version. */
  client_version: string;
  /** Milliseconds since start of session. */
  session_time: number;
  /** Formatted time since start of session.
   * @example `1:35:45.987`
   */
  session_time_formatted: string;
  /** Current path.
   * @example `/nb/klage/1234/begrunnelse`
   * */
  route: string;
  message: string;
}

interface NavigationEvent extends BaseEventData {
  type: FrontendEventTypes.NAVIGATION;
}

interface AppEvent extends BaseEventData {
  type: FrontendEventTypes.APP;
  action: string;
}

interface ErrorEvent extends BaseEventData {
  type: FrontendEventTypes.ERROR;
  message: string;
  stack?: string;
}

interface ApiEvent extends BaseEventData {
  type: FrontendEventTypes.API;
  request: string;
  response_time: number;
  status: number | string;
}

enum SessionAction {
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

interface SessionEvent extends BaseEventData {
  type: FrontendEventTypes.SESSION;
  message: string;
  action: SessionAction;
}

export type FrontendLogEvent = NavigationEvent | AppEvent | ErrorEvent | ApiEvent | SessionEvent;
