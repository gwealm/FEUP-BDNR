#!/bin/bash

docker run \
    -dit \
    --rm \
    --name "$1" \
    aerospike/aerospike-tools:latest \
    asadm \
    -h "$(docker inspect -f '{{.NetworkSettings.IPAddress }}' "$2")"

printf "enable\nmanage sindex create string user-email ns test set users bin email\n\nmanage sindex create numeric message-timestamp ns test set messages bin timestamp\nshow sindex\nexit\n" | script -q -c "docker attach $1" /dev/null