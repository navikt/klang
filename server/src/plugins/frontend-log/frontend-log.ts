import { getLogger, getTeamLogger } from '@app/logger';
import { FrontendEventTypes, Level, SessionAction } from '@app/plugins/frontend-log/types';
import { Type, type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('frontend-log');
const teamLog = getTeamLogger('frontend-log');

export const FRONTEND_LOG_PLUGIN_ID = 'frontend-log';

const SESSION_TIME_REGEX = /^(\d+):(\d+):(\d+)(?:\.(\d+))?$/;

const NAVIGATION_BASE = { type: Type.Literal(FrontendEventTypes.NAVIGATION) };

const APP_BASE = { type: Type.Literal(FrontendEventTypes.APP), action: Type.String() };

const SESSION_BASE = {
  type: Type.Literal(FrontendEventTypes.SESSION),
  message: Type.String(),
  action: Type.Enum(SessionAction),
};

const API_BASE = {
  type: Type.Literal(FrontendEventTypes.API),
  request: Type.String(),
  response_time: Type.Number({ description: 'API response time in milliseconds.' }),
  status: Type.Union([Type.Number(), Type.String()]),
};

const ERROR_BASE = {
  type: Type.Literal(FrontendEventTypes.ERROR),
  message: Type.String(),
  stack: Type.Optional(Type.String({ description: 'Stack trace of the error.' })),
};

const user_id = Type.Optional(Type.String({ description: 'User ID of the logged-in user.' }));

const LogEvent = Type.Union([
  Type.Object(NAVIGATION_BASE, { title: 'Navigation event' }),
  Type.Object(APP_BASE, { title: 'App event' }),
  Type.Object(SESSION_BASE, { title: 'Session event' }),
  Type.Object(API_BASE, { title: 'API event' }),
  Type.Object(ERROR_BASE, { title: 'Error event' }),
]);

const TeamLogEvent = Type.Union([
  Type.Object({ ...NAVIGATION_BASE, user_id }, { title: 'Navigation event' }),
  Type.Object({ ...APP_BASE, user_id }, { title: 'App event' }),
  Type.Object({ ...SESSION_BASE, user_id }, { title: 'Session event' }),
  Type.Object({ ...API_BASE, user_id }, { title: 'API event' }),
  Type.Object({ ...ERROR_BASE, user_id }, { title: 'Error event' }),
]);

const DEFAULT_PROPS = {
  session_id: Type.String(),
  level: Type.Enum(Level),
  client_timestamp: Type.Number({ description: 'Current client Unix timestamp in milliseconds.' }),
  token_expires: Type.Optional(Type.String({ description: 'DateTime when the token expires.' })),
  session_ends: Type.Optional(Type.String({ description: 'DateTime when the session ends.' })),
  is_logged_in: Type.Boolean(),
  client_version: Type.String(),
  session_time: Type.Number({ description: 'Milliseconds since start of session.' }),
  session_time_formatted: Type.String({
    description: 'Formatted time since start of session.',
    examples: ['0:35:45.987'],
    pattern: SESSION_TIME_REGEX.source,
  }),
  route: Type.String({
    description: 'Current path.',
    examples: ['/nb/sak/uuid-uuid-uuid-uuid/begrunnelse'],
  }),
  message: Type.String(),
};

const Default = Type.Object(DEFAULT_PROPS);
const TeamLogDefault = Type.Object({ ...DEFAULT_PROPS, user_id });

export const frontendLogPlugin = fastifyPlugin(
  async (app) => {
    app
      .withTypeProvider<TypeBoxTypeProvider>()
      .post('/frontend-log', { schema: { body: Type.Intersect([Default, LogEvent]) } }, (req, reply) => {
        const { level, message, ...data } = req.body;

        log[level]({ msg: message, data });

        reply.status(200).send();
      })
      .post(
        '/frontend-team-log',
        { schema: { body: Type.Intersect([TeamLogDefault, TeamLogEvent]) } },
        (req, reply) => {
          const { level, message, ...data } = req.body;

          teamLog[level]({ msg: message, data });

          reply.status(200).send();
        },
      );
  },
  { fastify: '5', name: FRONTEND_LOG_PLUGIN_ID },
);
