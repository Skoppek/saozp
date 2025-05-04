#! /bin/bash

echo 'Starting Judge0'
(cd judge0; docker compose up -d db redis; docker compose up -d)

echo 'Starting SAOZP'
docker compose up -d --build

# echo 'Removing auxiliary containers'
# docker compose rm -v -f
