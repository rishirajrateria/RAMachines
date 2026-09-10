#!/usr/bin/env bash
# scripts/ruflo-worker.sh — launch one ruflo agent as a headless Claude Code worker.
# Usage: scripts/ruflo-worker.sh <worker-id> <ruflo-agent-name> <prompt-file> [extra allowed tools]
# Logs → .claude-flow/logs/workers/<worker-id>.log ; completion receipt → ruflo memory (namespace ramachine).
set -uo pipefail
ID="$1"; AGENT="$2"; PROMPT_FILE="$3"; EXTRA="${4:-}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT/.claude-flow/logs/workers"; mkdir -p "$LOG_DIR"
LOG="$LOG_DIR/$ID.log"
TOOLS="Read,Write,Edit,MultiEdit,Glob,Grep,LS,Bash(npm run typecheck),Bash(npx tsc *),Bash(node scripts/*),Bash(ls *),Bash(wc *),Bash(cat *),Bash(head *),Bash(tail *),Bash(grep *),Bash(find *),Bash(mkdir *)"
[ -n "$EXTRA" ] && TOOLS="$TOOLS,$EXTRA"
cd "$ROOT"
npx ruflo agent spawn -t "$AGENT" --name "$ID" >/dev/null 2>&1 || true
echo "[$(date -u +%FT%TZ)] worker $ID ($AGENT) start" | tee "$LOG"
claude -p --agent "$AGENT" --permission-mode acceptEdits --allowedTools "$TOOLS" --max-turns 400 \
  --output-format text "$(cat "$PROMPT_FILE")" >>"$LOG" 2>&1
RC=$?
echo "[$(date -u +%FT%TZ)] worker $ID exit=$RC" | tee -a "$LOG"
npx ruflo memory store -k "worker/$ID/receipt" -v "agent=$AGENT exit=$RC finished=$(date -u +%FT%TZ)" --namespace ramachine >/dev/null 2>&1 || true
exit $RC
