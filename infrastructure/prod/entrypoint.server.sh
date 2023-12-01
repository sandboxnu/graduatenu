#!/bin/sh

cd packages/api-v2
echo "Running on commit: $COMMIT_HASH"
yarn typeorm migration:run 
exec "$@"

