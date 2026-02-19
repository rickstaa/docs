#!/usr/bin/env node
/**
 * @script spell-checker
 * @summary Utility script for tests/utils/spell-checker.js.
 * @owner docs
 * @scope tests
 *
 * @usage
 *   node tests/utils/spell-checker.js
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
 *   node tests/utils/spell-checker.js
 *
 * @notes
 *   Keep script behavior deterministic and update script indexes after changes.
 */
/**
 * Spell checking utilities using cspell
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Check spelling in a file
 */
function checkSpelling(filePath, configPath = null) {
  const cspellConfig = configPath || path.join(process.cwd(), 'cspell.json');
  
  try {
    // Run cspell check
    const result = execSync(
      `npx cspell --no-progress --config "${cspellConfig}" "${filePath}"`,
      { encoding: 'utf8', stdio: 'pipe' }
    );
    return { errors: [], output: result };
  } catch (error) {
    // Parse cspell output
    const output = error.stdout || error.message;
    const errors = parseCspellOutput(output, filePath);
    return { errors, output };
  }
}

/**
 * Parse cspell output to extract errors
 */
function parseCspellOutput(output, filePath) {
  const errors = [];
  const lines = output.split('\n');
  
  for (const line of lines) {
    // cspell output format: filePath:line:col - Unknown word: "word"
    const match = line.match(/:(\d+):(\d+)\s*-\s*Unknown word:\s*"([^"]+)"/);
    if (match) {
      errors.push({
        line: parseInt(match[1]),
        column: parseInt(match[2]),
        word: match[3],
        file: filePath
      });
    }
  }
  
  return errors;
}

/**
 * Check multiple files
 */
function checkMultipleFiles(filePaths, configPath = null) {
  const results = [];
  
  for (const filePath of filePaths) {
    if (fs.existsSync(filePath)) {
      const result = checkSpelling(filePath, configPath);
      results.push({
        file: filePath,
        ...result
      });
    }
  }
  
  return results;
}

module.exports = {
  checkSpelling,
  checkMultipleFiles,
  parseCspellOutput
};
