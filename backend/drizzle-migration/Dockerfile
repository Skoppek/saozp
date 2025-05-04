FROM oven/bun:1.2.11 AS build

COPY ./backend/package.json package.json
COPY ./backend/bun.lock bun.lock

RUN bun install

COPY ./backend/drizzle.config.ts .
COPY ./backend/src/db ./src/db
COPY ./backend/drizzle ./drizzle

ARG POSTGRES_URL
ENV POSTGRES_URL=$POSTGRES_URL

RUN apt-get update && \
apt-get install -y curl && \
curl -fsSL https://deb.nodesource.com/setup_current.x | bash - && \
apt-get install -y nodejs && \
apt-get clean && \
rm -rf /var/lib/apt/lists/*

CMD bunx drizzle-kit push