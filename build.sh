#!/usr/bin/env bash
chmod +x ./build.sh

npm install && cd frontend && npm install --production=false && npm run build