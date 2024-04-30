#!/bin/bash

docker run \
    -it \
    --name "$1" \
    aerospike/aerospike-tools:latest \
    aql \
    -h "$(docker inspect -f '{{.NetworkSettings.IPAddress }}' "$2")"