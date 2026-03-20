FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:8e5f0ecd9f0b0942a1a82dbcecf07bc8f63bdd205cc656530ece6fab976ba216

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
