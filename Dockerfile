FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:8523099f2cb1c3a47c2e20b7e4bfa8575766c5a1fcb94f9a4078387a6f23067d

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
