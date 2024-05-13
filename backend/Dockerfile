FROM imbios/bun-node:1.0.30-20-debian

WORKDIR /app

COPY package.json .
COPY bun.lockb .
COPY init.sh .
RUN chmod +x ./init.sh

RUN bun install --production

COPY src src
COPY drizzle drizzle
COPY tsconfig.json .
COPY drizzle.config.ts .

ENV NODE_ENV production

CMD ["./init.sh"]

EXPOSE 3000