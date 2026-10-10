#!/bin/sh
# Rebuild the scoped look stylesheets from css/src/. Each look only applies under
# :root[data-style=…], which app.js sets from the chosen aesthetic.
set -e
cd "$(dirname "$0")/.."
python3 tools/scope-css.py css/src/serene.css "[data-style='serene']" > css/serene.css
python3 tools/scope-css.py css/src/looks.css "[data-style='look']" > css/looks.css
echo "css/serene.css and css/looks.css rebuilt (css/aero.css is edited directly)"
