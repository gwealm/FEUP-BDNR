#!/bin/bash

docker run -it --rm --network container:bdnr-redis redis redis-cli
