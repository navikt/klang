FROM oven/bun:1

ENV NODE_ENV=production
ENV NPM_CONFIG_CACHE=/tmp

WORKDIR /usr/src/app
COPY server server
COPY frontend frontend

WORKDIR /usr/src/app/server

# This command will create an absolute path reference to JSDOM (used by nav-dekoratoren-moduler), which will not work if built outside Docker
RUN bun run build 

ARG VERSION
ENV VERSION=$VERSION

CMD bun run prod
EXPOSE 8080
