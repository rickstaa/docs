#!/usr/bin/env node
/**
 * @script generate-pages-index
 * @summary Generate and verify section-style index.mdx files for v2/pages folders, plus the root aggregate index.
 * @owner docs
 * @scope tools/scripts, v2/pages
 *
 * @usage
 *   node tools/scripts/generate-pages-index.js --write
 *
 * @inputs
 *   --staged Only run when staged files include v2/pages changes.
 *   --write Regenerate index files.
 *   --stage Stage generated index updates with git add.
 *   --rebuild-indexes Force full rebuild even when --staged has no matching files.
 *
 * @outputs
 *   - v2/pages/<top-level-folder>/index.mdx
 *   - v2/pages/index.mdx
 *
 * @exit-codes
 *   0 = success
 *   1 = validation or write/stage failure
 *
 * @examples
 *   node tools/scripts/generate-pages-index.js --staged --write --stage
 *
 * @notes
 *   Keep script behavior deterministic and update script indexes after changes.
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const PAGES_ROOT = 'v2/pages';
const INDEX_FILENAME = 'index.mdx';
const LEGACY_INDEX_FILENAME = 'index.md';
const DOCS_JSON_FILENAME = 'docs.json';

function getRepoRoot() {
  try {
    return execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
  } catch (_err) {
    return process.cwd();
  }
}

const REPO_ROOT = getRepoRoot();
const PAGES_ROOT_ABS = path.join(REPO_ROOT, PAGES_ROOT);

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function normalizeRel(relPath) {
  return toPosix(relPath).replace(/^\.\//, '').replace(/^\//, '');
}

function isMarkdownFile(fileName) {
  return /\.(md|mdx)$/i.test(fileName);
}

function isIndexFile(fileName) {
  const lower = fileName.toLowerCase();
  return lower === INDEX_FILENAME || lower === LEGACY_INDEX_FILENAME;
}

function sortAlpha(values) {
  return [...values].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
}

function getDirectSubdirs(absDir) {
  if (!fs.existsSync(absDir)) return [];
  const entries = fs.readdirSync(absDir, { withFileTypes: true });
  return sortAlpha(entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name));
}

function getDirectMarkdownFiles(absDir) {
  if (!fs.existsSync(absDir)) return [];
  const entries = fs.readdirSync(absDir, { withFileTypes: true });
  return sortAlpha(
    entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => isMarkdownFile(name) && !isIndexFile(name))
  );
}

function normalizeDocsRouteKey(routePath) {
  let normalized = normalizeRel(String(routePath || '').trim());
  normalized = normalized.replace(/\.(md|mdx)$/i, '');
  normalized = normalized.replace(/\/index$/i, '');
  normalized = normalized.replace(/\/+$/, '');
  return normalized;
}

function collectDocsPageEntries(node, out = []) {
  if (typeof node === 'string') {
    const value = node.trim();
    if (value.startsWith('v1/') || value.startsWith('v2/pages/')) {
      out.push(value);
    }
    return out;
  }

  if (Array.isArray(node)) {
    node.forEach((item) => collectDocsPageEntries(item, out));
    return out;
  }

  if (!node || typeof node !== 'object') {
    return out;
  }

  if (Array.isArray(node.pages)) {
    node.pages.forEach((item) => collectDocsPageEntries(item, out));
  }

  Object.values(node).forEach((value) => collectDocsPageEntries(value, out));
  return out;
}

function getDocsJsonRouteKeys() {
  const docsJsonAbs = path.join(REPO_ROOT, DOCS_JSON_FILENAME);
  if (!fileExists(docsJsonAbs)) {
    throw new Error(`Missing ${DOCS_JSON_FILENAME} at repo root`);
  }

  const docsJson = JSON.parse(fs.readFileSync(docsJsonAbs, 'utf8'));
  const versions = docsJson?.navigation?.versions || [];
  const entries = [];

  versions.forEach((versionNode) => {
    if (versionNode?.languages) {
      collectDocsPageEntries(versionNode.languages, entries);
    }
  });

  const keys = new Set();
  entries.forEach((entry) => {
    const key = normalizeDocsRouteKey(entry);
    if (key) keys.add(key);
  });

  return keys;
}

function sanitizeTitle(raw) {
  if (!raw) return '';
  let value = String(raw).trim();
  value = value.replace(/^['"]/, '').replace(/['"]$/, '').trim();
  return value;
}

function extractFrontmatterTitle(absFilePath) {
  try {
    const content = fs.readFileSync(absFilePath, 'utf8');
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)/);
    if (!frontmatterMatch) return '';

    const lines = frontmatterMatch[1].split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*title\s*:\s*(.+)\s*$/i);
      if (match) {
        return sanitizeTitle(match[1]);
      }
    }
  } catch (_err) {
    return '';
  }
  return '';
}

function formatToken(token) {
  if (!token) return '';
  if (/^[A-Z0-9]+$/.test(token)) return token;
  return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
}

function prettifyName(rawName) {
  const noExt = rawName.replace(/\.(md|mdx)$/i, '');
  const noPrefix = noExt.replace(/^\d+[_-]?/, '');
  const normalized = noPrefix.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!normalized) return rawName;
  return normalized
    .split(' ')
    .map((token) => formatToken(token))
    .join(' ');
}

function buildLinkHref(relPath) {
  const normalized = normalizeRel(relPath);
  const segments = normalized.split('/').filter(Boolean);
  return segments.map((segment) => encodeURIComponent(segment)).join('/');
}

function isExternalHref(href) {
  return /^(https?:\/\/|mailto:|#|\/)/i.test(href);
}

function prefixHref(prefixSegment, href) {
  if (!href || isExternalHref(href)) return href;
  const cleaned = href.replace(/^\.\//, '');
  const prefixed = normalizeRel(path.posix.join(prefixSegment, cleaned));
  return prefixed;
}

function escapeLinkText(text) {
  return text.replace(/\[/g, '\\[').replace(/\]/g, '\\]').trim();
}

const titleCache = new Map();

function getFileTitle(fileAbsPath, fallbackName) {
  const cacheKey = fileAbsPath;
  if (titleCache.has(cacheKey)) return titleCache.get(cacheKey);
  const frontmatterTitle = extractFrontmatterTitle(fileAbsPath);
  const resolved = frontmatterTitle || prettifyName(fallbackName);
  titleCache.set(cacheKey, resolved);
  return resolved;
}

function isMissingFromDocsJson(repoFileRel, docsRouteKeys) {
  if (!docsRouteKeys || docsRouteKeys.size === 0) return false;
  const routeKey = normalizeDocsRouteKey(repoFileRel);
  return !docsRouteKeys.has(routeKey);
}

function buildFolderIndexData(dirRel, docsRouteKeys) {
  const dirAbs = path.join(REPO_ROOT, dirRel);
  const rootFiles = getDirectMarkdownFiles(dirAbs).map((fileName) => {
    const repoFileRel = normalizeRel(path.join(dirRel, fileName));
    return {
      title: getFileTitle(path.join(dirAbs, fileName), fileName),
      href: buildLinkHref(fileName),
      missingFromDocsJson: isMissingFromDocsJson(repoFileRel, docsRouteKeys)
    };
  });

  const sections = [];

  function walk(localRel, depth) {
    const localAbs = path.join(REPO_ROOT, localRel);
    const subdirs = getDirectSubdirs(localAbs);

    for (const subdirName of subdirs) {
      const childRel = normalizeRel(path.join(localRel, subdirName));
      const childAbs = path.join(REPO_ROOT, childRel);
      const files = getDirectMarkdownFiles(childAbs).map((fileName) => {
        const repoFileRel = normalizeRel(path.join(childRel, fileName));
        const relFromCurrent = normalizeRel(path.relative(dirAbs, path.join(childAbs, fileName)));
        return {
          title: getFileTitle(path.join(childAbs, fileName), fileName),
          href: buildLinkHref(relFromCurrent),
          missingFromDocsJson: isMissingFromDocsJson(repoFileRel, docsRouteKeys)
        };
      });

      const beforeNestedCount = sections.length;
      walk(childRel, depth + 1);
      const hasNestedSections = sections.length > beforeNestedCount;

      if (files.length === 0 && !hasNestedSections) {
        continue;
      }

      sections.splice(beforeNestedCount, 0, {
        level: Math.min(depth + 1, 6),
        title: prettifyName(subdirName),
        links: files
      });
    }
  }

  walk(dirRel, 1);

  return {
    rootLinks: rootFiles,
    sections
  };
}

function renderLinkTitle(link) {
  const safeTitle = escapeLinkText(link.title || '');
  return link.missingFromDocsJson ? `⚠️ ${safeTitle}` : safeTitle;
}

function renderIndexContent(data) {
  const lines = ['# Table of contents', ''];

  if (data.rootLinks.length > 0) {
    for (const link of data.rootLinks) {
      lines.push(`- [${renderLinkTitle(link)}](${link.href})`);
    }
    if (data.sections.length > 0) {
      lines.push('');
    }
  }

  for (const section of data.sections) {
    lines.push(`${'#'.repeat(section.level)} ${section.title}`);
    if (section.links.length > 0) {
      for (const link of section.links) {
        lines.push(`- [${renderLinkTitle(link)}](${link.href})`);
      }
    }
    lines.push('');
  }

  if (data.rootLinks.length === 0 && data.sections.length === 0) {
    lines.push('_No markdown files found in this folder._');
  }

  return `${lines.join('\n').trimEnd()}\n`;
}

function parseIndexContent(content) {
  const lines = String(content || '').split('\n');
  const rootLinks = [];
  const sections = [];
  let currentSection = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const heading = line.match(/^(#{2,6})\s+(.+)$/);
    if (heading) {
      currentSection = {
        level: heading[1].length,
        title: heading[2].trim(),
        links: []
      };
      sections.push(currentSection);
      continue;
    }

    const link = line.match(/^- \[(.+?)\]\((.+?)\)$/);
    if (link) {
      const linkObj = {
        title: link[1].trim(),
        href: link[2].trim()
      };
      if (currentSection) {
        currentSection.links.push(linkObj);
      } else {
        rootLinks.push(linkObj);
      }
    }
  }

  return { rootLinks, sections };
}

function buildAggregateData(topLevelDirs, sourceByDirRel) {
  const groups = [];

  for (const dirRel of topLevelDirs) {
    const folderName = path.basename(dirRel);
    const source = sourceByDirRel.get(dirRel) || '';
    const parsed = parseIndexContent(source);

    groups.push({
      title: prettifyName(folderName),
      prefix: folderName,
      rootLinks: parsed.rootLinks,
      sections: parsed.sections
    });
  }

  return groups;
}

function renderAggregateContent(groups) {
  const lines = ['# Table of contents', ''];

  for (const group of groups) {
    lines.push(`## ${group.title}`);

    if (group.rootLinks.length > 0) {
      for (const link of group.rootLinks) {
        const prefixedHref = prefixHref(group.prefix, link.href);
        lines.push(`- [${escapeLinkText(link.title)}](${prefixedHref})`);
      }
      if (group.sections.length > 0) {
        lines.push('');
      }
    }

    for (const section of group.sections) {
      const level = Math.min(section.level + 1, 6);
      lines.push(`${'#'.repeat(level)} ${section.title}`);
      for (const link of section.links) {
        const prefixedHref = prefixHref(group.prefix, link.href);
        lines.push(`- [${escapeLinkText(link.title)}](${prefixedHref})`);
      }
      lines.push('');
    }

    if (group.rootLinks.length === 0 && group.sections.length === 0) {
      lines.push('_No markdown files found in this section._');
      lines.push('');
    }
  }

  return `${lines.join('\n').trimEnd()}\n`;
}

function readTextSafe(absPath) {
  try {
    return fs.readFileSync(absPath, 'utf8');
  } catch (_err) {
    return '';
  }
}

function writeIfChanged(absPath, nextContent) {
  const current = readTextSafe(absPath);
  if (current === nextContent) {
    return false;
  }
  fs.writeFileSync(absPath, nextContent);
  return true;
}

function fileExists(absPath) {
  try {
    return fs.existsSync(absPath);
  } catch (_err) {
    return false;
  }
}

function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACMRD', {
      encoding: 'utf8',
      cwd: REPO_ROOT
    });

    return output
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => normalizeRel(line));
  } catch (_err) {
    return [];
  }
}

function stagePaths(repoRelativePaths) {
  if (repoRelativePaths.length === 0) return null;
  const unique = [...new Set(repoRelativePaths.map((p) => normalizeRel(p)))];
  const result = spawnSync('git', ['add', '--', ...unique], {
    cwd: REPO_ROOT,
    encoding: 'utf8'
  });
  if (result.status !== 0) {
    return result.stderr || result.stdout || 'Unknown git add failure';
  }
  return null;
}

function findNestedIndexFiles(topLevelDirRel) {
  const topLevelAbs = path.join(REPO_ROOT, topLevelDirRel);
  if (!fileExists(topLevelAbs)) return [];

  const allowedTopLevelIndexes = new Set([
    normalizeRel(path.join(topLevelDirRel, INDEX_FILENAME)),
    normalizeRel(path.join(topLevelDirRel, LEGACY_INDEX_FILENAME))
  ]);

  const nested = [];

  function walk(currentAbs) {
    const entries = fs.readdirSync(currentAbs, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentAbs, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (!entry.isFile() || !isIndexFile(entry.name)) {
        continue;
      }
      const relPath = normalizeRel(path.relative(REPO_ROOT, fullPath));
      if (!allowedTopLevelIndexes.has(relPath)) {
        nested.push(relPath);
      }
    }
  }

  walk(topLevelAbs);
  return sortAlpha(nested);
}

function run(options = {}) {
  const stagedOnly = Boolean(options.stagedOnly);
  const write = Boolean(options.write);
  const stage = Boolean(options.stage);
  const rebuildIndexes = Boolean(options.rebuildIndexes);

  const errors = [];
  const warnings = [];
  const changed = [];
  const removedLegacy = [];
  const removedNested = [];

  if (!fileExists(PAGES_ROOT_ABS)) {
    errors.push(`Missing pages root: ${PAGES_ROOT}`);
    return { passed: false, skipped: false, errors, warnings, changed, removedLegacy, removedNested };
  }

  const stagedFiles = getStagedFiles();
  const hasStagedPagesChange = stagedFiles.some((file) => file === PAGES_ROOT || file.startsWith(`${PAGES_ROOT}/`));

  if (stagedOnly && !rebuildIndexes && !hasStagedPagesChange) {
    return { passed: true, skipped: true, errors, warnings, changed, removedLegacy, removedNested };
  }

  const topLevelDirs = getDirectSubdirs(PAGES_ROOT_ABS).map((name) => normalizeRel(path.join(PAGES_ROOT, name)));
  const expectedByTopDir = new Map();

  let docsRouteKeys = new Set();
  try {
    docsRouteKeys = getDocsJsonRouteKeys();
  } catch (error) {
    errors.push(`Failed to load ${DOCS_JSON_FILENAME}: ${error.message}`);
    return { passed: false, skipped: false, errors, warnings, changed, removedLegacy, removedNested };
  }

  for (const dirRel of topLevelDirs) {
    const data = buildFolderIndexData(dirRel, docsRouteKeys);
    const content = renderIndexContent(data);
    expectedByTopDir.set(dirRel, content);

    const indexAbs = path.join(REPO_ROOT, dirRel, INDEX_FILENAME);
    const legacyAbs = path.join(REPO_ROOT, dirRel, LEGACY_INDEX_FILENAME);
    const nestedIndexFiles = findNestedIndexFiles(dirRel);

    if (write) {
      const didWrite = writeIfChanged(indexAbs, content);
      if (didWrite) changed.push(normalizeRel(path.join(dirRel, INDEX_FILENAME)));

      if (fileExists(legacyAbs)) {
        fs.unlinkSync(legacyAbs);
        const legacyRel = normalizeRel(path.join(dirRel, LEGACY_INDEX_FILENAME));
        removedLegacy.push(legacyRel);
      }

      for (const nestedRel of nestedIndexFiles) {
        const nestedAbs = path.join(REPO_ROOT, nestedRel);
        if (fileExists(nestedAbs)) {
          fs.unlinkSync(nestedAbs);
          removedNested.push(nestedRel);
        }
      }
    } else {
      if (!fileExists(indexAbs)) {
        errors.push(`Missing ${INDEX_FILENAME}: ${normalizeRel(path.join(dirRel, INDEX_FILENAME))}`);
      } else {
        const current = readTextSafe(indexAbs);
        if (current !== content) {
          errors.push(`Outdated ${INDEX_FILENAME}: ${normalizeRel(path.join(dirRel, INDEX_FILENAME))}`);
        }
      }

      if (fileExists(legacyAbs)) {
        errors.push(`Legacy ${LEGACY_INDEX_FILENAME} must be migrated: ${normalizeRel(path.join(dirRel, LEGACY_INDEX_FILENAME))}`);
      }

      for (const nestedRel of nestedIndexFiles) {
        errors.push(`Nested index file must be removed: ${nestedRel}`);
      }
    }
  }

  const sourceByTopDir = new Map();
  topLevelDirs.forEach((dirRel) => sourceByTopDir.set(dirRel, expectedByTopDir.get(dirRel) || ''));

  const aggregate = renderAggregateContent(buildAggregateData(topLevelDirs, sourceByTopDir));
  const rootIndexAbs = path.join(PAGES_ROOT_ABS, INDEX_FILENAME);
  const rootLegacyAbs = path.join(PAGES_ROOT_ABS, LEGACY_INDEX_FILENAME);

  if (write) {
    const didWriteAggregate = writeIfChanged(rootIndexAbs, aggregate);
    if (didWriteAggregate) changed.push(normalizeRel(path.join(PAGES_ROOT, INDEX_FILENAME)));

    if (fileExists(rootLegacyAbs)) {
      fs.unlinkSync(rootLegacyAbs);
      const legacyRel = normalizeRel(path.join(PAGES_ROOT, LEGACY_INDEX_FILENAME));
      removedLegacy.push(legacyRel);
    }
  } else {
    if (!fileExists(rootIndexAbs)) {
      errors.push(`Missing root ${INDEX_FILENAME}: ${normalizeRel(path.join(PAGES_ROOT, INDEX_FILENAME))}`);
    } else {
      const current = readTextSafe(rootIndexAbs);
      if (current !== aggregate) {
        errors.push(`Outdated root ${INDEX_FILENAME}: ${normalizeRel(path.join(PAGES_ROOT, INDEX_FILENAME))}`);
      }
    }

    if (fileExists(rootLegacyAbs)) {
      errors.push(`Legacy root ${LEGACY_INDEX_FILENAME} must be migrated: ${normalizeRel(path.join(PAGES_ROOT, LEGACY_INDEX_FILENAME))}`);
    }
  }

  if (stage && write) {
    const stageTargets = [...new Set([...changed, ...removedLegacy, ...removedNested])];
    const stageError = stagePaths(stageTargets);
    if (stageError) {
      warnings.push(`Failed to stage generated index files: ${stageError}`);
    }
  }

  return {
    passed: errors.length === 0,
    skipped: false,
    errors,
    warnings,
    changed: [...new Set(changed)],
    removedLegacy: [...new Set(removedLegacy)],
    removedNested: [...new Set(removedNested)]
  };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const stagedOnly = args.includes('--staged');
  const write = args.includes('--write');
  const stage = args.includes('--stage');
  const rebuildIndexes = args.includes('--rebuild-indexes');

  const result = run({ stagedOnly, write, stage, rebuildIndexes });

  if (result.skipped) {
    console.log('ℹ️  No staged v2/pages changes detected; pages index generation skipped.');
    process.exit(0);
  }

  if (result.changed.length > 0) {
    console.log('\n📝 Updated page index files:');
    for (const file of result.changed) {
      console.log(`  - ${file}`);
    }
  }

  if (result.removedLegacy.length > 0) {
    console.log('\n🧹 Removed legacy index.md files:');
    for (const file of result.removedLegacy) {
      console.log(`  - ${file}`);
    }
  }

  if (result.removedNested.length > 0) {
    console.log('\n🧹 Removed nested index files:');
    for (const file of result.removedNested) {
      console.log(`  - ${file}`);
    }
  }

  if (result.warnings.length > 0) {
    console.warn('\n⚠️  Warnings:');
    for (const warning of result.warnings) {
      console.warn(`  - ${warning}`);
    }
  }

  if (!result.passed) {
    console.error('\n❌ Pages index generation/verification failed:');
    for (const error of result.errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  console.log('\n✅ Pages index checks passed');
  process.exit(0);
}

module.exports = { run };
