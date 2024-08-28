#! /bin/sh

echo 'Starting backend'

bunx drizzle-kit push
bun src/index.ts