#!/bin/sh

cd packages/api
yarn typeorm migration:run 
exec "$@"

