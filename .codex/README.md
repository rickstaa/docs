# Codex Local Locking

Local lock files in `.codex/locks-local/` prevent overlapping agent edits across concurrent Codex sessions.

## Why local

- Locks are operational state, not source artifacts.
- The directory is gitignored to avoid PR churn and merge conflicts.

## Lock schema

Each lock is a JSON file with this shape:

```json
{
  "lock_id": "string",
  "task_id": "string",
  "branch": "string",
  "worktree_path": "absolute-path",
  "owner": "string",
  "scope_in": ["repo-relative-path-or-prefix"],
  "created_at": "ISO-8601",
  "expires_at": "ISO-8601",
  "status": "active|released",
  "released_at": "ISO-8601 (optional)"
}
```

## Lifecycle

1. Create branch + contract + lock:
   - `node tools/scripts/codex/task-preflight.js --task <id> --slug <slug> --scope <a,b,c>`
2. Validate lock before commit/push:
   - `node tools/scripts/codex/validate-locks.js --branch codex/<id>-<slug> --staged`
3. Finalize checks before PR:
   - `node tools/scripts/codex/task-finalize.js --branch codex/<id>-<slug>`
4. Release lock after handoff/merge:
   - `node tools/scripts/codex/lock-release.js --branch codex/<id>-<slug>`
