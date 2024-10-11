#! /bin/bash

(cd ./judge0; docker compose up -d db redis; docker compose up -d)
docker compose up -d --build
docker compose rm -v -f
