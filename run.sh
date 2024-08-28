#! /bin/bash

(echo 'Starting Judge0' && cd judge0 && docker compose up -d)

(cd backend && ./run_psql.sh)

(cd frontend && ./run.sh) &

(cd backend && ./run.sh ) &