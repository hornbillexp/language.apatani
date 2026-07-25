#!/usr/bin/env node
// scripts/build-search.js
// Build a simple JSON search index from content/dictionary/*.md

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const contentDir = path.join(process.cwd(), 'content', 'dictionary');
const outDir = path.join(process.cwd(), 'assets', 'search');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = glob.sync(path.join(contentDir, '*.md'));
console.log('Indexing', files.length, 'entries');

const index = files.map(f => {
  const raw = fs.readFileSync(f, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  let meta = {};
  let body = raw;
  if (m) {
    const yaml = m[1];
    body = m[2].trim();
    yaml.split(/\n/).forEach(line => {
      const kv = line.match(/^([a-zA-Z0-9_]+):\s*"?(.*)"?$/);
      if (kv) meta[kv[1].trim()] = kv[2].trim();
    });
  }
  const filename = path.basename(f, '.md');
  return {
    id: filename,
    title: meta.title || filename,
    ipa: meta.ipa || '',
    pos: meta.pos || '',
    url: `/dictionary/${filename}/`,
    body: body.replace(/\n+/g, ' ').slice(0, 2000)
  };
});

fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(index, null, 2), 'utf8');
console.log('Wrote', path.join(outDir, 'index.json'));
