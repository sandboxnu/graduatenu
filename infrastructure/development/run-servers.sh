#!/bin/bash

if [[ ! " prod-build dev-build " =~ " $1 " ]]; then
  echo "Please provide environment to use: prod-build or dev-build"
  exit 1
fi

if [[ "dev-build" = "$1" ]]; then
    docker-compose -f ../../api/docker-compose.yml up & cd ../../frontend && yarn start
else
    docker-compose -f ../../api/docker-compose.yml up & docker build -t frontend -f ../../frontend/Dockerfile . && docker run -p 3000:80 frontend
fi