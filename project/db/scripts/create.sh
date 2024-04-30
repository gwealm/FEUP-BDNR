#!/bin/bash

docker run \
    -d \
    --name "$1" \
    -p 3000-3002:3000-3002 \
    aerospike/aerospike-server