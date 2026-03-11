#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXAMPLES_DIR="$ROOT_DIR/assets/examples"
OUT_FILE="$EXAMPLES_DIR/index.json"

if [[ ! -d "$EXAMPLES_DIR" ]]; then
  echo "Folder not found: $EXAMPLES_DIR" >&2
  exit 1
fi

files=()
while IFS= read -r -d '' f; do
  base="$(basename "$f")"
  [[ "$base" == "index.json" ]] && continue
  files+=("$base")
done < <(find "$EXAMPLES_DIR" -maxdepth 1 -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" -o -iname "*.svg" \) -print0 | sort -z)

{
  echo "["
  for i in "${!files[@]}"; do
    comma=","
    [[ $i -eq $((${#files[@]} - 1)) ]] && comma=""
    printf "  \"%s\"%s\n" "${files[$i]}" "$comma"
  done
  echo "]"
} > "$OUT_FILE"

echo "Wrote $((${#files[@]})) items to $OUT_FILE"
