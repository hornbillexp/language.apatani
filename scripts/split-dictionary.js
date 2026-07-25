#!/usr/bin/env node
// scripts/split-dictionary.js
// Splits dictionary/*.md (letter files) into per-entry Markdown files in content/dictionary/
// Usage: npm run split or: node scripts/split-dictionary.js

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function slugify(s) {
  return s.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const srcDir = path.join(process.cwd(), 'dictionary');
const outDir = path.join(process.cwd(), 'content', 'dictionary');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = glob.sync(path.join(srcDir, '*.md'));
console.log('Found', files.length, 'letter files');

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // split on entry heading lines that start with __word__
  const parts = content.split(/\n(?=__[^_]+__\s)/g);
  // If the file begins with a YAML front matter, skip the first part that is the header
  // but our dictionary letter files appear to start directly with entries or a frontmatter block which will remain as part[0]

  parts.forEach((part, idx) => {
    const lines = part.split('\n');
    const headingLine = lines[0] || '';
    const titleMatch = headingLine.match(/^__([^_]+)__/);
    if (!titleMatch) {
      // Skip non-entry fragment (like top-of-file frontmatter or noise)
      return;
    }
    const title = titleMatch[1].trim();
    const ipaMatch = headingLine.match(/\/([^\/]*)\//);
    const ipa = ipaMatch ? ipaMatch[1].trim() : '';
    const posMatch = headingLine.match(/_([A-Za-z.\- ]+)_/);
    const pos = posMatch ? posMatch[1].trim() : '';

    const body = lines.slice(1).join('\n').trim();
    const slug = slugify(title) || `${path.basename(file, '.md')}-${idx}`;
    const outPath = path.join(outDir, `${slug}.md`);

    const front = [];
    front.push('---');
    front.push(`title: "${title.replace(/\"/g, '\\"')}"`);
    if (ipa) front.push(`ipa: "${ipa.replace(/\"/g, '\\"')}"`);
    if (pos) front.push(`pos: "${pos.replace(/\"/g, '\\"')}"`);
    front.push(`permalink: "/dictionary/${slug}/"`);
    front.push('layout: dictionary_entry');
    front.push('source: split-script');
    front.push('---\n');

    const outContent = front.join('\n') + body + '\n';
    fs.writeFileSync(outPath, outContent, 'utf8');
    console.log('Wrote', outPath);
  });
});

console.log('Done.');
