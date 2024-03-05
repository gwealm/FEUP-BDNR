#!/bin/bash

docker run -d --name bdnr-redis -v ${PWD}/redis-data:/data -p 6379:6379 redis
composer install
php -S localhost:8080
