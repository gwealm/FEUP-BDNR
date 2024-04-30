#!/bin/bash

# TODO: we need to wait for a bit, this handles the job but we should be careful
sleep 2

docker run \
    -it \
    --mount type=bind,source=./scripts/populate_scripts,target=/populate_scripts \
    aerospike/aerospike-tools:latest \
    aql \
    -h "$(docker inspect -f '{{.NetworkSettings.IPAddress }}' "$1")" \
    -f "/populate_scripts/$2"