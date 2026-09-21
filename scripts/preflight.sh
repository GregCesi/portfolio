#!/usr/bin/env bash
# Pré-vol d'aptitude de l'environnement d'exécution — TCK-120.
# Répond à « mon environnement est-il apte », jamais à « mon travail est-il bon ».
# Un rouge ici est un arrêt sur environnement inapte, pas un verdict sur le travail.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

[ -f "$ROOT/package.json" ] || {
  echo "PRÉ-VOL: package.json absent à $ROOT — environnement non initialisé." >&2
  exit 2
}

LAYOUT="app/layouts/preflight-probe.vue"
PAGE="app/pages/preflight-probe.vue"
CREATED_DIRS=()

cleanup() {
  local code=$?
  rm -f "$ROOT/$LAYOUT" "$ROOT/$PAGE"
  local d
  for d in "${CREATED_DIRS[@]+"${CREATED_DIRS[@]}"}"; do
    rmdir "$ROOT/$d" 2>/dev/null || true
  done
  rm -rf "$ROOT/.nuxt" "$ROOT/.output" "$ROOT/dist"
  exit "$code"
}
trap cleanup EXIT

for d in app app/layouts app/pages; do
  [ -d "$ROOT/$d" ] || { mkdir -p "$ROOT/$d"; CREATED_DIRS=("$d" "${CREATED_DIRS[@]+"${CREATED_DIRS[@]}"}"); }
done

cat > "$ROOT/$LAYOUT" <<'VUE'
<script setup lang="ts">
const label: string = 'preflight'
</script>

<template>
  <div :data-preflight="label"><slot /></div>
</template>
VUE

cat > "$ROOT/$PAGE" <<'VUE'
<script setup lang="ts">
definePageMeta({ layout: 'preflight-probe' })
const value: number = 1
</script>

<template>
  <p>{{ value }}</p>
</template>
VUE

[ -d "$ROOT/node_modules" ] || {
  echo "PRÉ-VOL: node_modules absent, installation."
  npm install
}


echo "PRÉ-VOL: build"
npm run build

echo "PRÉ-VOL: generate"
npm run generate

echo "PRÉ-VOL: apte."
