#!/bin/sh

cd packages/api-v2
yarn typeorm migration:run 
exec "$@"