#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails.
rm -f /app/tmp/pids/server.pid

rails db:migrate 2>/dev/null || rails db:setup
rails s -p 80 -b '0.0.0.0'

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"