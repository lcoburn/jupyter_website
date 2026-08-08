// Site structure: subjects (top tabs) -> topics (sub-tabs) -> notebooks (pills).
// Generated from content/ by scripts/build-manifest.mjs (runs with `npm run lite:build`).
// To add a notebook: drop the .ipynb into content/<subject>/<topic>/ and rebuild.

import manifest from './notebooks.json'

export const subjects = manifest.subjects

export function findSubject(subjectId) {
  return subjects.find((s) => s.id === subjectId)
}

export function findTopic(subject, topicId) {
  return subject?.topics.find((t) => t.id === topicId)
}

export function findNotebook(topic, notebookId) {
  return topic?.notebooks.find((n) => n.id === notebookId)
}

// Standalone JupyterLite single-notebook URL (Notebook 7 interface: just the
// toolbar/run line, no file browser or sidebars). This is also the URL to use
// when embedding this notebook as an iframe elsewhere (e.g. Moodle).
export function notebookUrl(notebook) {
  return `/lite/notebooks/index.html?path=${notebook.path}`
}
