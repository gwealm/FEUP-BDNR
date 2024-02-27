#!/bin/bash

docker run -d --name bdnr-redis -v ${PWD}/../redis-data:/data -p 6379:6379 redis

php -S localhost:8000 &

docker run -it --rm --network container:bdnr-redis redis redis-cli