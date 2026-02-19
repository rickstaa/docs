# Task R-01: Fix CI gate reliability and workflow validity

## Why
Retrospective claims "CI gates block failing PRs". Current workflow files need validation and fixes before this is fully defensible.

## Scope
- Validate YAML syntax and GitHub Actions schema for all workflows in `.github/workflows/`
- Fix malformed files (starting with `.github/workflows/test-suite.yml`)
- Resolve merge-conflict markers in issue templates (`.github/ISSUE_TEMPLATE/feature_internal.yml`)
- Confirm required tests actually run and fail PRs on failure

## Acceptance
- All workflow files parse successfully
- PR checks run end-to-end on a test PR
- A failing test causes a failed required check
- Evidence documented in `tasks/reports/`
