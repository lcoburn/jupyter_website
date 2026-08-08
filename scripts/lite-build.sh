#!/bin/bash
# Builds JupyterLite into public/lite.
# Works locally (uses the project venv) and on Netlify (no venv; jupyter-lite
# comes from Netlify's automatic `pip install -r requirements.txt`).
set -e

node scripts/build-manifest.mjs
rm -rf dist

if [ -x ./venv/bin/jupyter-lite ]; then
  ./venv/bin/jupyter-lite build --output-dir public/lite
else
  jupyter-lite build --output-dir public/lite
fi
