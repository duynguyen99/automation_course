#!/bin/sh
# Virtual display for the headed Chromium that learner Selenium code launches.
set -e
Xvfb :99 -screen 0 1366x900x24 -nolisten tcp >/dev/null 2>&1 &
exec node /app/runner/server.mjs
