#! /bin/bash

echo 'Starting frontend'

bun install
bun run build
bun run preview --host