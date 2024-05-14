#!/bin/bash

IMAGE_NAME=app

docker build -t "$IMAGE_NAME" .

docker network create --driver bridge app-network

docker run --name "web-app" -p 5173:5173 "$IMAGE_NAME"
docker network connect app-network web-app
docker network connect app-network aerospike
