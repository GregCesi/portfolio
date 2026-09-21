#!/usr/bin/env bash
# Critère 6 de quality-gate.md — reconstructibilité.
set -euo pipefail
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

git clone --quiet "$SRC" "$TMP/clone"
cd "$TMP/clone"
npm ci
echo "RECONSTRUCTIBILITÉ: 0"
