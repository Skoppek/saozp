FROM oven/bun AS build

COPY ./backend/package.json package.json
COPY ./backend/bun.lockb bun.lockb

RUN bun install

COPY ./backend/drizzle.config.ts .
COPY ./backend/src/model ./src/model
COPY ./backend/drizzle ./drizzle

RUN apt-get update && \
apt-get install -y curl && \
curl -fsSL https://deb.nodesource.com/setup_current.x | bash - && \
apt-get install -y nodejs && \
apt-get clean && \
rm -rf /var/lib/apt/lists/*

CMD bunx drizzle-kit push