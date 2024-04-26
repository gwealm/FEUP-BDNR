#!/bin/sh

docker ps -a --format '{{.Names}}' | grep 'neo4j' | xargs -r docker stop

docker ps -a --format '{{.Names}}' | grep 'neo4j' | xargs -r docker rm

docker system prune -af --volumes && docker image prune -a

# ./init/create_image.sh && ./init/populate.sh;
