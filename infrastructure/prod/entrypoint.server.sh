#!/bin/sh

cd packages/api
echo "Running on commit: $COMMIT_HASH"
yarn typeorm migration:run 
exec "$@"

