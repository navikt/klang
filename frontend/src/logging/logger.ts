import { ENVIRONMENT } from '@app/environment/environment';
import { isNotUndefined } from '@app/functions/is-not-type-guards';
import { getUniqueId } from '@app/functions/uuid';
import type { AppEventEnum } from '@app/logging/action';
import { formatSessionTime } from '@app/logging/formatters';
import { send } from '@app/logging/send';
import { type BaseEventData, EventTypes, Level, SESSION_ACTIONS, type SessionAction } from '@app/logging/types';

const START_TIME = Date.now();
const SESSION_ID = getUniqueId();

class FrontendLogger {
  private tokenExpiresAt: string | undefined;
  private sessionEndsAt: string | undefined;

  private getBase = (level: Level): BaseEventData => {
    const now = Date.now();
    const sessionTime = now - START_TIME;

    return {
      session_id: SESSION_ID,
      client_version: ENVIRONMENT.version,
      level,
      client_timestamp: now,
      session_time: sessionTime,
      session_time_formatted: formatSessionTime(sessionTime),
      route: window.location.pathname,
      token_expires: this.tokenExpiresAt,
      session_ends: this.sessionEndsAt,
      is_logged_in: this.tokenExpiresAt !== undefined,
      user_agent: navigator.userAgent,
    };
  };

  public navigationEvent = () =>
    send({ type: EventTypes.NAVIGATION, message: 'App navigation', ...this.getBase(Level.DEBUG) });

  public appEvent = (action: AppEventEnum) =>
    send({ type: EventTypes.APP, message: action, action, ...this.getBase(Level.DEBUG) });

  public errorEvent = (message: string, stack?: string) =>
    send({
      type: EventTypes.ERROR,
      message,
      stack,
      ...this.getBase(Level.ERROR),
    });

  public apiEvent = (
    endpoint: string,
    method: string,
    startTime: number,
    status: number | string = 'NO_STATUS',
    message?: string,
  ) => {
    const request = `${method} ${status} ${endpoint}`;
    const response_time = Math.round(performance.now() - startTime);

    send({
      type: EventTypes.API,
      message: [`${request} (${response_time} ms)`, message].filter(isNotUndefined).join(' - '),
      status,
      request,
      response_time,
      ...this.getBase(Level.DEBUG),
    });
  };

  public sessionEvent = (action: SessionAction) =>
    send({ type: EventTypes.SESSION, action, message: SESSION_ACTIONS[action], ...this.getBase(Level.DEBUG) });

  public setTokenExpires = (tokenExpires: string) => {
    this.tokenExpiresAt = tokenExpires;
  };

  public setSessionEndsAt = (sessionEndsAt: string) => {
    this.sessionEndsAt = sessionEndsAt;
  };
}

export const { apiEvent, appEvent, errorEvent, navigationEvent, sessionEvent, setTokenExpires, setSessionEndsAt } =
  new FrontendLogger();
