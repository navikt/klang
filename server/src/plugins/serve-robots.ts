import fastifyPlugin from 'fastify-plugin';

export const SERVE_ROBOTS_PLUGIN_ID = 'serve-robots';

export const serveRobotsPlugin = fastifyPlugin(
  async (app) => {
    app.get('/robots.txt', async (_, reply) => reply.redirect('https://cdn.nav.no/klage/klang/assets/robots.txt', 301));
  },
  { fastify: '5', name: SERVE_ROBOTS_PLUGIN_ID },
);
