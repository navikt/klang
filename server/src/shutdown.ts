import { setTimeout as sleep } from 'node:timers/promises';
import { getLogger } from '@app/logger';
import type { FastifyInstance } from 'fastify';

const log = getLogger('shutdown');

// Nais' default preStop hook sleeps 5s before SIGTERM, so the ingress has already stopped routing to this pod.
// preStop (5s) + close (20s) must leave time for shutting down tracing within the termination grace period (30s).
const CLOSE_TIMEOUT_MS = 20_000;

enum CloseResult {
  CLOSED = 0,
  TIMEOUT = 1,
}

let server: FastifyInstance | null = null;
let shutdownPromise: Promise<void> | null = null;

const openStreams = new Set<() => void>();

export const isShuttingDown = () => shutdownPromise !== null;

export const registerServer = (app: FastifyInstance) => {
  server = app;
};

/**
 * Registers a function that cleanly ends a long-lived response (e.g. an event stream) on shutdown.
 * Returns a function that unregisters it.
 */
export const registerOpenStream = (end: () => void): (() => void) => {
  if (isShuttingDown()) {
    end();

    return () => undefined;
  }

  openStreams.add(end);

  return () => {
    openStreams.delete(end);
  };
};

/**
 * Cleanly ends open event streams and waits for in-flight requests before the process exits.
 * Exiting immediately cuts open responses, which Wonderwall logs as "unexpected EOF".
 */
export const gracefulShutdown = (): Promise<void> => {
  shutdownPromise ??= shutdown();

  return shutdownPromise;
};

const shutdown = async () => {
  if (openStreams.size > 0) {
    log.info({ msg: `Ending ${openStreams.size} open event streams` });

    for (const end of openStreams) {
      end();
    }

    openStreams.clear();
  }

  if (server === null) {
    return;
  }

  try {
    const result = await Promise.race([
      server.close().then(() => CloseResult.CLOSED),
      sleep(CLOSE_TIMEOUT_MS, CloseResult.TIMEOUT, { ref: false }),
    ]);

    if (result === CloseResult.TIMEOUT) {
      log.warn({ msg: `Server did not close within ${CLOSE_TIMEOUT_MS}ms` });
    } else {
      log.info({ msg: 'Server closed' });
    }
  } catch (error) {
    log.error({ msg: 'Failed to close server', error });
  }
};

/** Shutdown state is global, and Bun shares modules between test files. Only for tests. */
export const resetShutdownState = () => {
  server = null;
  shutdownPromise = null;
  openStreams.clear();
};
