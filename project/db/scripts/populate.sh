#!/bin/bash

# TODO: we need to wait for a bit, this handles the job but we should be careful
sleep 2

docker run \
    -it \
    --mount type=bind,source=./scripts/db_scripts,target=/db_scripts \
    aerospike/aerospike-tools:latest \
    aql \
    -h "$(docker inspect -f '{{.NetworkSettings.IPAddress }}' "$1")" \
    -f "/db_scripts/$2"