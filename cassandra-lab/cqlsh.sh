#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: $0 <container_name>"
    exit 1
fi

container_name=$1



docker run -it --rm \
        --network container:$container_name \
        cassandra cqlsh