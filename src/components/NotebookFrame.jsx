import { notebookUrl } from '../data/sections'

// The notebook iframe. Points at the JupyterLite Notebook 7 single-notebook
// interface: just the toolbar/run line — no file browser, no sidebars,
// no nested navigation.
function NotebookFrame({ notebook }) {
  return (
    <iframe
      key={notebook.path}
      src={notebookUrl(notebook)}
      title={notebook.title}
      className="w-full h-full border-0 rounded-xl shadow-lg bg-white"
      allow="cross-origin-isolated"
    />
  )
}

export default NotebookFrame
