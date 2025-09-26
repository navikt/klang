import { AppEventEnum } from '@app/logging/action';
import { apiEvent, appEvent } from '@app/logging/logger';
import { userApi } from '@app/redux-api/user/api';

export enum ServerSentEventType {
  JOURNALPOSTID = 'journalpostId',
}

type ServerSentEvent = MessageEvent<string>;

type ListenerFn<T> = (event: T) => void;
type EventListenerFn = (event: Event) => void;
type EventListener = [ServerSentEventType, EventListenerFn];

export class ServerSentEventManager {
  private events: EventSource;
  private listeners: EventListener[] = [];
  private connectionListeners: ListenerFn<boolean>[] = [];
  private url: string;
  private lastEventId: string | null = null;

  public isConnected = false;

  constructor(url: string, initialEventId: string | null = null) {
    this.url = url;
    this.lastEventId = initialEventId;
    this.events = this.createEventSource();
  }

  public addConnectionListener(listener: ListenerFn<boolean>) {
    if (!this.connectionListeners.includes(listener)) {
      this.connectionListeners.push(listener);
    }

    listener(this.isConnected);
  }

  public addEventListener(eventName: ServerSentEventType, listener: ListenerFn<ServerSentEvent>) {
    const eventListener: EventListenerFn = (event) => {
      appEvent(AppEventEnum.SSE_EVENT_RECEIVED);

      if (isServerSentEvent(event)) {
        this.lastEventId = event.lastEventId;
        listener(event);
      }
    };

    this.listeners.push([eventName, eventListener]);
    this.events.addEventListener(eventName, eventListener);

    return this;
  }

  private removeAllEventListeners() {
    if (this.events !== undefined) {
      for (const [event, listener] of this.listeners) {
        this.events.removeEventListener(event, listener);
      }
    }
  }

  private async preflight(url: string): Promise<boolean> {
    const startTime = performance.now();

    try {
      const { status } = await fetch(url, { method: 'GET' });
      apiEvent(url, 'GET', status, 'Preflight for SSE connection.');

      return status >= 200 && status < 400;
    } catch {
      apiEvent(url, 'GET', startTime, 'NETWORK_ERROR', 'Preflight for SSE connection failed.');

      return false;
    }
  }

  private createEventSource(): EventSource {
    const url = this.lastEventId === null ? this.url : `${this.url}?lastEventId=${this.lastEventId}`;

    const events = new EventSource(url);

    events.addEventListener('error', () => {
      appEvent(AppEventEnum.SSE_ERROR);

      if (events.readyState !== EventSource.CLOSED) {
        return;
      }

      this.isConnected = false;
      for (const listener of this.connectionListeners) {
        listener(this.isConnected);
      }

      setTimeout(async () => {
        const preflightOK = await this.preflight(url);

        if (!preflightOK) {
          // Probably the session timed out. Double check the logged in status.
          userApi.util.invalidateTags(['user']);

          return;
        }

        this.events = this.createEventSource();
      }, 3000);
    });

    events.addEventListener('open', () => {
      appEvent(AppEventEnum.SSE_OPEN);
      for (const [event, listener] of this.listeners) {
        events.addEventListener(event, listener);
      }
      this.isConnected = true;
      for (const listener of this.connectionListeners) {
        listener(this.isConnected);
      }
    });

    return events;
  }

  public close() {
    appEvent(AppEventEnum.SSE_CLOSE);
    this.events?.close();
    this.removeAllEventListeners();
  }
}

const isServerSentEvent = (event: Event): event is ServerSentEvent => 'data' in event && typeof event.data === 'string';
