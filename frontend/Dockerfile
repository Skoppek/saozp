FROM oven/bun:1.1.30 AS build

WORKDIR /app

COPY package.json package.json
COPY bun.lockb bun.lockb

RUN bun install

COPY ./src ./src
COPY ./index.html .

RUN bun --bunx vite build

FROM nginx:alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
