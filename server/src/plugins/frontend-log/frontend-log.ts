import { getLogger } from '@app/logger';
import { FrontendEventTypes, Level, SessionAction } from '@app/plugins/frontend-log/types';
import { Type, type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('frontend-log');

export const FRONTEND_LOG_PLUGIN_ID = 'frontend-log';

export const frontendLogPlugin = fastifyPlugin(
  async (app) => {
    app.withTypeProvider<TypeBoxTypeProvider>().post(
      '/frontend-log',
      {
        schema: {
          body: Type.Composite([
            Type.Object({
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
                format: 'time',
                examples: ['1:35:45.987'],
              }),
              route: Type.String({
                description: 'Current path.',
                examples: ['/nb/sak/uuid-uuid-uuid-uuid/begrunnelse'],
              }),
              message: Type.String(),
            }),
            Type.Union([
              // Navigation event
              Type.Object({
                type: Type.Literal(FrontendEventTypes.NAVIGATION),
              }),
              // App event
              Type.Object({
                type: Type.Literal(FrontendEventTypes.APP),
                action: Type.String(),
              }),
              // Session event
              Type.Object({
                type: Type.Literal(FrontendEventTypes.SESSION),
                message: Type.String(),
                action: Type.Enum(SessionAction),
              }),
              // API event
              Type.Object(
                {
                  type: Type.Literal(FrontendEventTypes.API),
                  request: Type.String(),
                  response_time: Type.Number({ description: 'API response time in milliseconds.' }),
                  status: Type.Union([Type.Number(), Type.String()]),
                },
                { description: 'API event.' },
              ),
              // Error event
              Type.Object(
                {
                  type: Type.Literal(FrontendEventTypes.ERROR),
                  message: Type.String(),
                  stack: Type.Optional(Type.String({ description: 'Stack trace of the error.' })),
                },
                { description: 'Error event.' },
              ),
            ]),
          ]),
        },
      },
      (req, reply) => {
        const { level, message, ...data } = req.body;

        log[level]({ msg: message, data });

        reply.status(200).send();
      },
    );
  },
  { fastify: '4', name: FRONTEND_LOG_PLUGIN_ID },
);