# Testing Suite

## Installation

Testing dependencies are scoped to `tests/` (or `tools/` in some workflows) so root docs setup is not changed.

### Option 1: Install in `tests/` (Recommended)

```bash
cd tests
npm install
```

### Option 2: Install globally

```bash
npm install -g puppeteer @cspell/dict-en-gb cspell js-yaml
```

## Test Scripts

### Main Runner
- `node tests/run-all.js`
Runs unit + integration suite.

### Unit Suites
- `node tests/unit/style-guide.test.js`
- `node tests/unit/mdx.test.js`
- `node tests/unit/spelling.test.js`
- `node tests/unit/quality.test.js`
- `node tests/unit/links-imports.test.js`
- `node tools/scripts/generate-pages-index.js`

### Integration Suites
- `node tests/integration/browser.test.js`
Browser rendering checks (local server flow).

- `node tests/integration/domain-pages-audit.js`
Domain load audit against deployed docs URLs.

Flags:
- `--staged` only checks staged docs pages
- `--base-url <url>` sets target domain (default: `https://docs.livepeer.org`)
- `--version v1|v2|both` filters scope (default: `both`)

Report output (same file each run, overwritten):
- `tests/reports/domain-page-load-report.json`

## Running Tests

### All Tests
```bash
node tests/run-all.js
```

### Domain Audit Examples
```bash
node tests/integration/domain-pages-audit.js --version both
node tests/integration/domain-pages-audit.js --version v1
node tests/integration/domain-pages-audit.js --version v2
node tests/integration/domain-pages-audit.js --staged --version both
node tests/integration/domain-pages-audit.js --base-url https://docs.livepeer.org --version both
```

### npm Scripts (`tests/package.json`)
```bash
npm --prefix tests run test
npm --prefix tests run test:style
npm --prefix tests run test:mdx
npm --prefix tests run test:spell
npm --prefix tests run test:quality
npm --prefix tests run test:links
npm --prefix tests run test:pages-index
npm --prefix tests run test:pages-index:write
npm --prefix tests run test:pages-index:rebuild
npm --prefix tests run test:browser
npm --prefix tests run test:domain
npm --prefix tests run test:domain:v1
npm --prefix tests run test:domain:v2
npm --prefix tests run test:domain:both
```

## Pre-commit Interaction
- Pre-commit runs `tests/run-all.js --staged --skip-browser` in fast mode.
- Pre-commit also runs domain audit on staged docs pages:
  `node tests/integration/domain-pages-audit.js --staged --base-url https://docs.livepeer.org --version "$DOMAIN_AUDIT_VERSION"`
- Set `DOMAIN_AUDIT_VERSION=v1|v2|both` to control scope in pre-commit.
- Pre-commit enforces script header docs for newly added scripts and auto-updates script indexes:
  `node tests/unit/script-docs.test.js --staged --write --stage --autofill`
  Missing headers are auto-inserted, then commit remains blocked until placeholder values are filled.
- Pre-commit also synchronizes `v2/pages` index files:
  `node tools/scripts/generate-pages-index.js --staged --write --stage`
  This regenerates top-level section `index.mdx` files, updates root `v2/pages/index.mdx`, marks missing `docs.json` pages with `⚠️`, and removes nested `index.mdx`/`index.md` files.

## Script Header Template (Required for New Scripts)
Newly added scripts must include these tags near the top of the file:
- `@script`
- `@summary`
- `@owner`
- `@scope`
- `@usage`
- `@inputs`
- `@outputs`
- `@exit-codes`
- `@examples`
- `@notes`

Example:
```js
/**
 * @script domain-pages-audit
 * @summary Audit deployed docs page load status.
 * @owner docs
 * @scope tests/integration, tests/reports
 *
 * @usage
 *   node tests/integration/domain-pages-audit.js --version both
 *
 * @inputs
 *   --version v1|v2|both (default: both)
 *   --base-url <url> (default: https://docs.livepeer.org)
 *
 * @outputs
 *   - tests/reports/domain-page-load-report.json
 *
 * @exit-codes
 *   0 = success
 *   1 = failures or invalid config
 *
 * @examples
 *   node tests/integration/domain-pages-audit.js --staged --version v2
 *
 * @notes
 *   Overwrites the same report file each run.
 */
```

### Auto-create Script Template
Use the generator to create a new script with header already attached:
```bash
node tools/scripts/new-script.js --path tools/scripts/my-script.js
node tools/scripts/new-script.js --path tasks/scripts/my-script.sh --owner docs --scope tasks/scripts
```

{/* SCRIPT-INDEX:START */}
## Script Index

| Script | Summary | Usage |
|---|---|---|
| `tests/integration/domain-pages-audit.js` | Audit deployed docs page load status and emit a stable JSON report. | `node tests/integration/domain-pages-audit.js --version both` |
| `tests/unit/script-docs.test.js` | Enforce script header schema, keep group script indexes in sync, and build aggregate script index. | `node tests/unit/script-docs.test.js --staged --write --stage --autofill` |
{/* SCRIPT-INDEX:END */}
