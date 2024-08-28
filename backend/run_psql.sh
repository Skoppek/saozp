#! /bin/bash

echo 'Starting database'

docker run \
-e POSTGRES_PASSWORD=postgres \
-e POSTGRES_USER=postgres \
-e POSTGRES_DB=saozp \
-v ./psql:/var/lib/postgresql/data \
-p 5000:5432 \
--name saozp-db \
-d postgres