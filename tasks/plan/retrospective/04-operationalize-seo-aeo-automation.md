# Task R-04: Operationalize SEO/AEO automation

## Why
SEO/AEO script exists (`tools/scripts/snippets/generate-seo.js`), but systematic enforcement/coverage is not yet clear.

## Scope
- Define when and how SEO/AEO generation runs (pre-commit, CI, scheduled, or manual release step)
- Add verification checks for required frontmatter fields and description quality
- Publish runbook for maintainers

## Acceptance
- SEO/AEO process is automated and documented
- CI or release gate confirms required metadata coverage
- Report generated showing coverage baseline
