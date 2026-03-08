---
title: 'Scripts Audit'
sidebarTitle: 'Scripts Audit'
description: 'Generated tasks folder audit reports from tools/scripts/audit-tasks-folders.js.'
keywords: ["livepeer","internal","reports","repo-ops","audit-tasks-folders"]
og:image: "/snippets/assets/domain/SHARED/LivepeerDocsLogo.svg"
---
Last Generated (UTC ISO): `2026-03-03T09:45:28.411Z`
Last Generated (UTC Human): `March 03, 2026 09:45 UTC`
Generator Script: `tools/scripts/audit-tasks-folders.js`
What It Does: Audit tasks folders, optionally normalize report locations, and optionally apply audit recommendations with conflict-safe moves.
Audited Scope: `tasks/scripts`
Outputs:
- tasks/reports/repo-ops/*_audit.md (one report per audited folder, plus tasks_root_audit.md)
- File moves/deletes in tasks/reports + tasks/report when --apply is set
- tasks/reports/repo-ops/recommendation-apply-summary.json when --apply-recommendations is set (non dry-run)
- tasks/reports/repo-ops/recommendation-conflicts.md when conflicts exist (non dry-run)
# tasks/scripts Audit

Generated: 2026-03-03T09:45:12.427Z
Scope: `tasks/scripts`
Total files in scope: 6

## Summary

- Rows: 6
- Recommendation: keep in tasks/scripts: 6

## File Recommendations

| File | Used For | Stale PLAN Paths | Exact Duplicates in tools/scripts | Purpose Overlap in tools/scripts | Recommendation | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| tasks/scripts/audit-minimal.js | Minimal smoke audit that validates docs.json access and checks a subset of pages. | no |  |  | keep in tasks/scripts | no overlap or deprecation signal |
| tasks/scripts/audit-python.py | Python implementation of v2 pages audit with JSON/Markdown report output. | no |  |  | keep in tasks/scripts | no overlap or deprecation signal |
| tasks/scripts/README.md | Tasks/scripts local README and script index anchor. | no | tools/scripts/README.md<br />tools/scripts/snippets/generate-data/README.md | tools/scripts/README-test-v2-pages.md<br />tools/scripts/dev/README-add-callouts.md<br />tools/scripts/dev/README.mdx<br />tools/scripts/dev/SEO-GENERATOR-README.md<br />tools/scripts/i18n/README.mdx<br />tools/scripts/snippets/README.mdx | keep in tasks/scripts | folder-level README |
| tasks/scripts/run-audit-now.js | Node wrapper to execute comprehensive audit script immediately and mark run status. | no |  |  | keep in tasks/scripts | no overlap or deprecation signal |
| tasks/scripts/script-index.md | General task script. | no |  |  | keep in tasks/scripts | no overlap or deprecation signal |
| tasks/scripts/test-audit.js | Sanity check for docs.json parsing and basic audit preconditions. | no |  |  | keep in tasks/scripts | no overlap or deprecation signal |
