# Netlify CMS + Dictionary splitter

This branch adds tooling to convert the repository's dictionary letter-files (dictionary/a.md, b.md, ...) into per-entry Markdown files and configures Netlify CMS to manage the resulting content.

Quick start (local)

1. Install dependencies (glob is used by the scripts):

   npm init -y
   npm install glob

2. Run the splitter:

   node scripts/split-dictionary.js

   This will create files under content/dictionary/*.md with YAML front matter and a permalink field.

3. Build the search index (optional):

   node scripts/build-search.js

   Writes assets/search/index.json which is consumed by assets/js/search.js

Netlify CMS

- The admin UI is located at /admin/ (admin/index.html) and configured by admin/config.yml.
- To use the GitHub backend you must configure a GitHub OAuth application or use Netlify Identity + Git Gateway when hosting on Netlify.

Jekyll layout

- A new layout `_layouts/dictionary_entry.html` renders each dictionary entry.

Notes

- The scripts use simple regex heuristics that work with the current file formatting. If you encounter parsing issues for particular entries, tell me which words fail and I will refine the parser.
