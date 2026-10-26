#!/usr/bin/env bash
# Consistent copy of the database (safe while the app is running), kept for 30 days.
set -euo pipefail
DB=/var/lib/sse/sse.db
OUT=/var/backups/sse
[[ -f "$DB" ]] || exit 0
FILE="$OUT/sse-$(date +%Y%m%d-%H%M%S).db"
sqlite3 "$DB" ".backup '$FILE'"
gzip "$FILE"
chmod 600 "$FILE.gz"
find "$OUT" -name 'sse-*.db.gz' -mtime +30 -delete
