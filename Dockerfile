FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:39bb593e952ecf8c75817dfa936914cbf82513b85af7ba37d94b3543f34a53df

ENV NODE_ENV=production
ENV NPM_CONFIG_CACHE=/tmp

WORKDIR /usr/src/app

COPY server/dist server/dist
COPY server/node_modules server/node_modules
COPY frontend/dist/index.html frontend/dist/index.html

WORKDIR /usr/src/app/server

ARG VERSION
ENV VERSION=$VERSION

CMD ["--trace-warnings", "dist/server.js"]
EXPOSE 8080
