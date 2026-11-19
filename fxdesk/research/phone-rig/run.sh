#!/bin/sh
# Runs the simulated-iPhone scenarios against the code in this checkout. See flows.cjs for what they are.
# Usage: ./run.sh [scenario ...]
cd "$(dirname "$0")" || exit 1
export MOCK_STORE="${MOCK_STORE:-$PWD/store.json}" PORT="${PORT:-8811}" URL="https://fx-desk-ict.netlify.app"
node --import ./register.mjs server.mjs > server.log 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
sleep 2
node flows.cjs "$@"
