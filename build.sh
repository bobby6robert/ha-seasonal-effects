#!/bin/sh
# Builds dist/seasonal-effects.js from src/ (engine + card). No dependencies needed.
set -e
cd "$(dirname "$0")"
VERSION=$(grep -o "SE_VERSION = '[^']*'" src/engine.js | cut -d"'" -f2)
{ printf '/*! Seasonal Effects for Home Assistant v%s | MIT | https://github.com/bobby6robert/ha-seasonal-effects */\n' "$VERSION"; cat src/engine.js; echo; cat src/card.js; } > dist/seasonal-effects.js
node --check dist/seasonal-effects.js && echo "built dist/seasonal-effects.js v$VERSION"
