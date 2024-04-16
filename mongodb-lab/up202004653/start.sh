#!/bin/bash

# creates the mongodb docker container if it doesn't yet exist
if ! docker ps -a -q -f name=bdnr-mongo >/dev/null; then
    docker create \
           --name bdnr-mongo \
           -v ${PWD}/mongo_data:/data/db \ 
           -p 27017:27017 \ 
           mongo 
fi

docker start bdnr-mongo
php -S localhost:8080

