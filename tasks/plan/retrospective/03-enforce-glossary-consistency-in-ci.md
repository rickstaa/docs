# Task R-03: Enforce glossary consistency in CI

## Why
Glossary generation exists, but retrospective claims "automated terminology enforcement"; enforcement is not currently guaranteed.

## Scope
- Define glossary policy checks (missing core terms, stale term index, required glossary links)
- Add CI step that fails on policy violations
- Add docs for contributor workflow and remediation

## Acceptance
- CI job validates glossary policy on PRs
- Clear failure output points to fix steps
- Governance/docs guide updated with terminology policy
