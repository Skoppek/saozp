FROM oven/bun:1.1.30 AS build

WORKDIR /app

# Cache packages installation
COPY package.json package.json
COPY bun.lockb bun.lockb

RUN bun install

COPY ./src ./src
COPY ./drizzle.config.ts .
COPY ./drizzle ./drizzle

ARG DB_CONNECTION_STRING
ENV DB_CONNECTION_STRING $DB_CONNECTION_STRING
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