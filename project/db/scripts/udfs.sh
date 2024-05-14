#!/bin/bash

if [ $# -ne 2 ]; then
    echo "Usage: $0 [container-name] [aerospike-server-container]"
    exit 1
fi

container_id=$(docker run \
    -dit \
    --rm \
    --mount type=bind,source=./scripts/db_scripts,target=/db_scripts \
    --name "$1" \
    aerospike/aerospike-tools:latest \
    asadm \
    -h "$(docker inspect -f '{{.NetworkSettings.IPAddress }}' "$2")")

if [ -z "$container_id" ]; then
    echo "Failed to start the Aerospike tools container."
    exit 1
fi

echo "Aerospike tools container started successfully, ID: $container_id"

printf "enable \
        manage udfs add module.lua path /db_scripts/scripts.lua \
        \nshow udfs \
        \nexit \
        \n" | script -q -c "docker attach $1" aerospike_logs.txt

if grep -q "Error" aerospike_logs.txt; then
    echo "An error occurred while registering UDFs. Check aerospike_logs.txt for details."
    exit 1
fi

echo "UDFs registered successfully. Details in aerospike_logs.txt"

# Stop the container
# docker stop "$1"
