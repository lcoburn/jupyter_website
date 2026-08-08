// Scans content/<subject>/<topic>/*.ipynb and writes src/data/notebooks.json.
// Runs automatically as part of `npm run lite:build`.
//
// - Notebook display title = first "# Heading" found in the notebook,
//   falling back to a prettified filename.
// - Notebooks are sorted alphabetically by filename — use numeric prefixes
//   (01_intro.ipynb, 02_demo.ipynb) to control the order.
// - Subjects/topics use the preferred orders below; unknown ones are
//   appended alphabetically.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const CONTENT_DIR = new URL('../content', import.meta.url).pathname
const OUT_FILE = new URL('../src/data/notebooks.json', import.meta.url).pathname

const SUBJECT_ORDER = ['applied-maths', 'physics']
const TOPIC_ORDER = ['units', 'vectors', 'mechanics']

const PRETTY_NAMES = {
  'applied-maths': 'Applied Maths',
  physics: 'Physics',
}

function prettify(id) {
  return id
    .replace(/\.ipynb$/, '')
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function sortByPreference(ids, preferred) {
  return ids.sort((a, b) => {
    const ia = preferred.indexOf(a)
    const ib = preferred.indexOf(b)
    if (ia !== -1 || ib !== -1) {
      return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib)
    }
    return a.localeCompare(b)
  })
}

function notebookTitle(file, fallbackId) {
  try {
    const nb = JSON.parse(readFileSync(file, 'utf8'))
    for (const cell of nb.cells ?? []) {
      if (cell.cell_type !== 'markdown') continue
      const text = Array.isArray(cell.source) ? cell.source.join('') : cell.source ?? ''
      const match = text.match(/^#\s+(.+)$/m)
      if (match) return match[1].trim()
    }
  } catch {
    // fall through to prettified filename
  }
  return prettify(fallbackId)
}

function isVisible(entry) {
  return !entry.startsWith('.') && entry !== 'node_modules'
}

const subjects = []
for (const subjectId of sortByPreference(readdirSync(CONTENT_DIR).filter(isVisible), SUBJECT_ORDER)) {
  const topics = []
  for (const topicId of sortByPreference(
    readdirSync(join(CONTENT_DIR, subjectId), { withFileTypes: true })
      .filter((e) => e.isDirectory() && isVisible(e.name))
      .map((e) => e.name),
    TOPIC_ORDER,
  )) {
    const topicDir = join(CONTENT_DIR, subjectId, topicId)
    const notebooks = readdirSync(topicDir)
      .filter((f) => f.endsWith('.ipynb') && isVisible(f))
      .sort()
      .map((file) => {
        const id = file.replace(/\.ipynb$/, '')
        return {
          id,
          title: notebookTitle(join(topicDir, file), id),
          path: `${subjectId}/${topicId}/${file}`,
        }
      })
    topics.push({ id: topicId, name: prettify(topicId), notebooks })
  }
  subjects.push({ id: subjectId, name: PRETTY_NAMES[subjectId] ?? prettify(subjectId), topics })
}

writeFileSync(OUT_FILE, JSON.stringify({ subjects }, null, 2) + '\n')
const count = subjects.flatMap((s) => s.topics.flatMap((t) => t.notebooks)).length
console.log(`manifest: ${subjects.length} subjects, ${count} notebooks -> src/data/notebooks.json`)
