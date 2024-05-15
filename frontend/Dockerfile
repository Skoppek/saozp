FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install

COPY src src
COPY tsconfig.json .
COPY index.html .
COPY vite.config.ts .
COPY tsconfig.node.json .
COPY postcss.config.js .
COPY tailwind.config.js .

ENV NODE_ENV production

RUN bun run build

CMD ["bun", "run", "preview"]

EXPOSE 5173