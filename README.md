# Maths & Physics Notebooks

A teaching website with interactive, in-browser Jupyter notebooks (JupyterLite) for Applied Maths and Physics. Python runs entirely in the browser via WebAssembly (Pyodide) — no server, no installs for students.

## Features

- Top tabs: **Applied Maths** and **Physics**
- Sub-topics in each: **Units**, **Vectors**, **Mechanics**
- Each sub-topic is a page with a Jupyter notebook filling the page
- Notebooks use JupyterLite's single-notebook interface: just the toolbar/run line, no file browser or nested navigation
- Every notebook has a standalone URL, so it can be embedded as an iframe anywhere (e.g. Moodle)

## Running Locally

### Prerequisites

- Node.js (18+)
- Python 3 (10+)

### First-time setup

```bash
npm run setup
```

This installs npm packages, creates a Python virtual environment in `venv/`, installs JupyterLite, and builds the notebooks into `public/lite/`.

### Development

```bash
npm run dev
```

The site is at `http://localhost:5173`. If you add or edit notebooks in `content/`, rebuild them with:

```bash
npm run lite:build
```

### Build

```bash
npm run lite:build   # JupyterLite -> public/lite
npm run build        # site -> dist (copies public/lite along)
```

## Deployment to Netlify via GitHub

Same flow as the physics_website:

1. Push to GitHub.
2. In Netlify: "Add new site" → import the repo. Everything is pre-configured:
   - `netlify.toml` — build command (`npm run lite:build && npm run build`), publish dir (`dist`), SPA redirects, COOP/COEP headers
   - `runtime.txt` — Python version; Netlify auto-runs `pip install -r requirements.txt` and `npm install`
3. Deploy.

**Every `git push` to `main` auto-redeploys the site.** Pull requests get preview deployments.

Typical edit-publish loop:

```bash
npm run notebooks          # edit & save notebooks
npm run lite:build         # verify locally (optional)
git add . && git commit -m "..." && git push   # Netlify takes it from there
```

## Project Structure

```
jupyter_website/
├── content/                 # Notebook sources (edit these!)
│   ├── applied-maths/
│   │   ├── units/           # one folder per topic, any number of .ipynb inside
│   │   ├── vectors/
│   │   └── mechanics/
│   └── physics/
│       ├── units/           # e.g. 00_units.ipynb + demos
│       ├── vectors/
│       └── mechanics/
├── scripts/build-manifest.mjs # scans content/ -> src/data/notebooks.json
├── src/
│   ├── components/
│   │   ├── TopTabs.jsx      # Subject tabs (Applied Maths | Physics)
│   │   ├── SubTabs.jsx      # Topic tabs (Units | Vectors | Mechanics)
│   │   ├── NotebookPills.jsx# Notebook picker within a topic (always shown)
│   │   └── NotebookFrame.jsx# Notebook iframe
│   ├── data/sections.js     # Helpers over the generated manifest
│   ├── pages/SubjectPage.jsx
│   └── App.jsx
├── public/lite/             # Built JupyterLite (generated, git-ignored)
├── jupyter_lite_config.json # JupyterLite build config (points at content/)
├── requirements.txt         # Python deps for the JupyterLite build (Netlify)
├── requirements-dev.txt     # + JupyterLab & notebook packages (local editing)
└── netlify.toml
```

## Adding or Editing Notebooks

> **Important:** editing notebooks *inside the website's embedded interface* only saves to
> your browser's local storage — not to any file. Those edits won't deploy, won't show up in
> git, and they **shadow** the real files (you'll keep seeing your browser version even after
> rebuilding). Always edit the source files in `content/` as described below.

The editing workflow (changes are permanent and deployable):

```bash
npm run notebooks
```

This opens JupyterLab rooted at the `content/` folder. Edit, run, and save notebooks there —
saving writes the real `.ipynb` files. Then:

```bash
npm run lite:build   # rebuild the site notebooks from content/
```

and refresh the website (the dev server picks up `public/lite` automatically).

Alternative: open the `.ipynb` files directly in VS Code / Cursor, which has a built-in
notebook editor — same rule applies: edit files in `content/`, then `npm run lite:build`.

**`ModuleNotFoundError` in local JupyterLab?** The venv only has the packages listed in
`requirements-dev.txt` (numpy, matplotlib). If a notebook needs more, install it with
`./venv/bin/pip install <package>` and add it to `requirements-dev.txt`. The website's
in-browser Pyodide kernel already includes the common scientific packages.

To add a notebook: drop the `.ipynb` into `content/<subject>/<topic>/` and run
`npm run lite:build` — it appears on the site automatically. Notes:

- A topic can hold any number of notebooks; the picker row always shows, even with a single notebook, so the current notebook's name is visible.
- The display title is the notebook's first `# Heading` (fallback: prettified filename).
- Notebooks are ordered alphabetically by filename — use prefixes like `00_`, `01_` to
  control the order.
- New topic = new folder under `content/<subject>/`; new subject = new folder under
  `content/` (subjects/topics follow the preferred order in `scripts/build-manifest.mjs`).

### "The site shows an old version of my notebook!"

Your browser has a locally-saved copy shadowing the file. Clear the site's browser data
(DevTools → Application → Storage → Clear site data, or just test in an incognito window) and
reload. Students on Moodle never hit this unless they've edited the notebook themselves.

## Embedding a Notebook in Moodle

Each notebook is a standalone page. In Moodle, add an iframe (or a "Page"/label with HTML) pointing at the deployed site's notebook URL:

```html
<iframe src="https://jupyterwebsite.netlify.app/lite/notebooks/index.html?path=applied-maths/vectors/vectors.ipynb"
        width="100%" height="800" style="border:0;"></iframe>
```

Swap `applied-maths/vectors/vectors.ipynb` for any path under `content/`. Note the URL
pattern is `?path=<subject>/<topic>/<file>.ipynb` — the standalone notebook page, *not* the
website route (so Moodle gets just the notebook, without the site's tabs and header).
Alternatively, add a Moodle **URL** activity with **Appearance → Display → Embed** — no HTML
needed.

## Tech Stack

- **React 18 + Vite + Tailwind CSS** — site shell
- **react-router-dom** — routing
- **JupyterLite (Notebook 7 interface) + Pyodide** — in-browser notebooks
