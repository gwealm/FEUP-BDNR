#!/bin/bash

docker run \
    -it \
    --rm \
    --mount type=bind,source=./scripts/db_scripts,target=/db_scripts \
    --name "$1" \
    aerospike/aerospike-tools:latest \
    asadm \
    -h "$(docker inspect -f '{{.NetworkSettings.IPAddress }}' "$2")"