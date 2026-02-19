# Git Hooks - Quick Reference

This directory contains git hooks for enforcing repository standards.

**📖 Full Documentation:** See [docs/CONTRIBUTING/GIT-HOOKS.md](../../docs/CONTRIBUTING/GIT-HOOKS.md)

## Quick Start

```bash
# Install hooks
./.githooks/install.sh
```

Or start local docs dev (auto-installs/updates hooks first):

```bash
lpd dev
# or without PATH setup
bash lpd dev
```

## Pre-commit Hook

The pre-commit hook enforces style guide compliance and runs verification scripts:

### Style Guide Checks

- ❌ **ThemeData usage** - Blocks deprecated ThemeData imports
- ❌ **Hardcoded colors** - Warns about hardcoded hex colors that should use CSS variables
- ⚠️ **Relative imports** - Warns about relative imports (should use absolute paths)
- ⚠️ **@mintlify/components imports** - Warns about unnecessary imports (components are global)
- ⚠️ **React hook imports** - Warns about unnecessary React imports (hooks are global)

### Verification Scripts

The hook also runs `.githooks/verify.sh` which checks:

- ✅ **MDX syntax** - Validates frontmatter and basic MDX structure
- ✅ **JSON syntax** - Validates JSON files are parseable
- ✅ **Shell script syntax** - Validates shell scripts with `bash -n`
- ✅ **JavaScript syntax** - Validates JS files with `node --check`
- ✅ **Mintlify config** - Validates docs.json/mint.json syntax
- ✅ **Import paths** - Ensures snippets imports use absolute paths
- ✅ **Browser validation** - Tests MDX files in headless browser (requires `mint dev` running)

### Test Suite + Domain Audit

The pre-commit hook also runs:

- `node tests/unit/script-docs.test.js --staged --write --stage --autofill`
- `node tools/scripts/generate-pages-index.js --staged --write --stage`
- `node tests/run-all.js --staged --skip-browser`
- `node tests/integration/domain-pages-audit.js --staged --base-url https://docs.livepeer.org --version "$DOMAIN_AUDIT_VERSION"`

Domain audit scope:
- `DOMAIN_AUDIT_VERSION=v1`
- `DOMAIN_AUDIT_VERSION=v2`
- `DOMAIN_AUDIT_VERSION=both` (default)

Domain audit report path (stable, overwritten each run):
- `tests/reports/domain-page-load-report.json`

Script documentation enforcement:
- Newly added scripts must include required header tags.
- Missing headers are auto-inserted on pre-commit.
- If valid, group `script-index.md` files and aggregate index are auto-updated and staged.
- If invalid, commit is blocked.

Pages index generation:
- Keeps `v2/pages/<top-level>/index.mdx` synchronized with the full folder + subfolder markdown structure.
- Uses section-style rendering with root-level files listed first, then folder headings.
- Adds `⚠️` to links for files that are not present in `docs.json` navigation.
- Rebuilds root aggregate at `v2/pages/index.mdx` from top-level section index files.
- Migrates/removes legacy `index.md` files and removes nested index files under top-level sections.

Current script index targets:
- `.githooks/*` -> `.githooks/script-index.md`
- `.github/scripts/*` -> `.github/script-index.md`
- `tests/*` -> `tests/script-index.md`
- `tools/scripts/*` -> `tools/script-index.md`
- `tasks/scripts/*` -> `tasks/script-index.md`
- Aggregate -> `docs-guide/scripts-index.md`

Example:
```bash
DOMAIN_AUDIT_VERSION=v2 git commit -m "docs update"
```

## Installation

To install the pre-commit hook:

```bash
cp .githooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

Or use the install script:

```bash
./.githooks/install.sh
```

## Manual Installation

If the install script doesn't work:

```bash
# Copy the hook
cp .githooks/pre-commit .git/hooks/pre-commit

# Make it executable
chmod +x .git/hooks/pre-commit

# Verify it's installed
ls -la .git/hooks/pre-commit
```

## Testing

Test the hook by staging a file with a violation:

```bash
# Create a test file with ThemeData (should fail)
echo 'import { ThemeData } from "/snippets/styles/themeStyles.jsx";' > test-violation.jsx
git add test-violation.jsx
git commit -m "test"  # Should be blocked

# Clean up
rm test-violation.jsx
git reset HEAD test-violation.jsx
```

## Bypassing (Not Recommended)

If you absolutely must bypass the hook (not recommended):

```bash
git commit --no-verify -m "message"
```

**Warning:** Only bypass if you have a legitimate reason and understand the style guide violations.

### Human-Only `.whitelist` Override

The `.whitelist` file is protected by the pre-commit hook.

If a human needs to intentionally edit `.whitelist`, use:

```bash
git commit -m "Update .whitelist" --trailer "allow-whitelist-edit=true"
```

This allows `.whitelist` edits while still running all other checks.

### Human-Only Deletions Override

File deletions are blocked by default outside `tasks/`.

If a human intentionally needs to delete files, use:

```bash
git commit -m "Remove obsolete files" --trailer "allow-deletions=true"
```

This allows deletions while still running all other checks.

## Style Guide Reference

See: `v2/pages/07_resources/documentation-guide/style-guide.mdx`

{/* SCRIPT-INDEX:START */}
## Script Index

_No documented scripts found in this scope yet._
{/* SCRIPT-INDEX:END */}
