FROM oven/bun:1.1.30 AS build

WORKDIR /app

# Cache packages installation
COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install

COPY ./src ./src
COPY ./drizzle.config.ts .
COPY ./drizzle ./drizzle

ENV NODE_ENV=production

RUN bun build \
--compile \
--minify-whitespace \
--minify-syntax \
--target bun \
--outfile server \
./src/index.ts

FROM oven/bun:1.1.30

WORKDIR /app

COPY --from=build /app/server server

ENV NODE_ENV=production
CMD ["./server"]

EXPOSE 3000