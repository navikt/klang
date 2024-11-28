import type { AppEventEnum } from '@app/logging/action';

export enum Level {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export enum EventTypes {
  NAVIGATION = 'navigation',
  APP = 'app',
  ERROR = 'error',
  API = 'api',
  SESSION = 'session',
}

export interface BaseEventData {
  session_id: string;
  level: Level;
  /** Current client Unix timestamp in milliseconds. */
  client_timestamp: number;
  /** DateTime when the token expires. */
  token_expires?: string;
  /** DateTime when the session ends. */
  session_ends?: string;
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
  /** User agent string. */
  user_agent: string;
}

interface CommonEventData {
  message: string;
}

interface NavigationEvent extends BaseEventData, CommonEventData {
  type: EventTypes.NAVIGATION;
}

interface AppEvent extends BaseEventData, CommonEventData {
  type: EventTypes.APP;
  action: AppEventEnum;
}

interface ErrorEvent extends BaseEventData, CommonEventData {
  type: EventTypes.ERROR;
  stack?: string;
}

interface ApiEvent extends BaseEventData, CommonEventData {
  type: EventTypes.API;
  request: string;
  response_time: number;
  status: number | string;
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

export const SESSION_ACTIONS: Record<SessionAction, string> = {
  [SessionAction.LOAD]: 'Load session case',
  [SessionAction.CREATE]: 'Create session case',
  [SessionAction.LOAD_OR_CREATE]: 'Load or create session case',
  [SessionAction.DELETE]: 'Delete session case',
  [SessionAction.SET]: 'Set session case',
  [SessionAction.UPDATE]: 'Update session case',
};

interface SessionEvent extends BaseEventData, CommonEventData {
  type: EventTypes.SESSION;
  message: string;
  action: SessionAction;
}

export type LogEvent = NavigationEvent | AppEvent | ErrorEvent | ApiEvent | SessionEvent;
