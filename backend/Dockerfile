FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY src src
COPY tsconfig.json .

ENV JUDGE0_HOST = http://localhost
ENV JUDGE0_PORT = 2358

ENV PSQL_CONNECTION_STRING = postgres://skopek:skopek@localhost:5432/et-db
ENV PSQL_HOST = localhost
ENV PSQL_USER = skopek
ENV PSQL_PASSWORD = skopek
ENV PSQL_NAME = et-db

# RUN bunx drizzle-kit generate:pg

ENV NODE_ENV production

CMD ["bun", "src/index.ts"]

EXPOSE 3000