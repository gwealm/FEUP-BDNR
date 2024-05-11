#!/bin/bash

if [ $# -ne 2 ]; then
    echo "Usage: $0 [container-name] [aerospike-server-container]"
    exit 1
fi

container_id=$(docker run \
    -dit \
    --rm \
    --name "$1" \
    aerospike/aerospike-tools:latest \
    asadm \
    -h "$(docker inspect -f '{{.NetworkSettings.IPAddress }}' "$2")")

if [ -z "$container_id" ]; then
    echo "Failed to start the Aerospike tools container."
    exit 1
fi

echo "Aerospike tools container started successfully, ID: $container_id"

# commands=$(cat <<-END
# enable
# manage sindex create string user-email ns test set users bin email
# manage sindex create string user-username ns test set users bin username
# manage sindex create numeric message-timestamp ns test set messages bin timestamp
# show sindex
# exit
# END
# )

printf "enable\nmanage sindex create string user-email ns test set users bin email\n\nmanage sindex create string user-username ns test set users bin username\n\nmanage sindex create numeric message-timestamp ns test set messages bin timestamp\nshow sindex\nexit\n" | script -q -c "docker attach $1" aerospike_logs.txt

# script -q -c "printf '%s\n' '$commands' | docker attach $1" aerospike_logs.txt

if grep -q "Error" aerospike_logs.txt; then
    echo "An error occurred while creating indexes. Check aerospike_logs.txt for details."
    exit 1
fi

echo "Indexes created successfully. Details in aerospike_logs.txt"

# Stop the container
# docker stop "$1"
