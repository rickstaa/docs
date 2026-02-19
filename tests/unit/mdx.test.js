#!/usr/bin/env node
/**
 * @script mdx.test
 * @summary Utility script for tests/unit/mdx.test.js.
 * @owner docs
 * @scope tests
 *
 * @usage
 *   node tests/unit/mdx.test.js
 *
 * @inputs
 *   No required CLI flags; optional flags are documented inline.
 *
 * @outputs
 *   - Console output and/or file updates based on script purpose.
 *
 * @exit-codes
 *   0 = success
 *   1 = runtime or validation failure
 *
 * @examples
 *   node tests/unit/mdx.test.js
 *
 * @notes
 *   Keep script behavior deterministic and update script indexes after changes.
 */
/**
 * MDX validation tests
 */

const { getMdxFiles, getStagedDocsPageFiles, readFile } = require('../utils/file-walker');
const { validateMdx } = require('../utils/mdx-parser');

let errors = [];
let warnings = [];

/**
 * Run MDX validation tests
 */
function runTests(options = {}) {
  errors = [];
  warnings = [];
  
  const { files = null, stagedOnly = false } = options;
  
  let testFiles = files;
  if (!testFiles) {
    if (stagedOnly) {
      testFiles = getStagedDocsPageFiles().filter(f => f.endsWith('.mdx'));
    } else {
      testFiles = getMdxFiles();
    }
  }
  
  testFiles.forEach(file => {
    const content = readFile(file);
    if (!content) return;
    
    const result = validateMdx(content, file);
    errors.push(...result.errors.map(err => ({
      file,
      ...(typeof err === 'string' ? { message: err } : err)
    })));
    warnings.push(...result.warnings.map(warn => ({
      file,
      message: warn
    })));
  });
  
  return {
    errors,
    warnings,
    passed: errors.length === 0,
    total: testFiles.length
  };
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const stagedOnly = args.includes('--staged');
  
  const result = runTests({ stagedOnly });
  
  if (result.errors.length > 0) {
    console.error('\n❌ MDX Validation Errors:\n');
    result.errors.forEach(err => {
      const line = err.line ? `:${err.line}` : '';
      console.error(`  ${err.file}${line} - ${err.message || err}`);
    });
  }
  
  if (result.warnings.length > 0) {
    console.warn('\n⚠️  MDX Warnings:\n');
    result.warnings.forEach(warn => {
      console.warn(`  ${warn.file} - ${warn.message}`);
    });
  }
  
  if (result.passed) {
    console.log(`\n✅ MDX validation passed (${result.total} files checked)`);
    process.exit(0);
  } else {
    console.error(`\n❌ ${result.errors.length} error(s) found`);
    process.exit(1);
  }
}

module.exports = { runTests };
