#!/bin/bash

docker-compose up -d

bun i install -g artillery

artillery run -o report.json -q artillery.yaml

# artillery report --output report.html report.json

docker-compose down