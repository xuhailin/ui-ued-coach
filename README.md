# UI/UED Coach Workspace

This workspace is a lightweight home for a 14-day UI/UED training track aimed at frontend developers.

## Purpose

- Keep the daily coaching plan in one place
- Store practice records and feedback
- Accumulate page analysis notes and design judgment over time

## Structure

- `AGENTS.md`: working rules for the coaching thread
- `docs/index.html`: local homepage and GitHub Pages entry
- `docs/motion-lab.html`: creative motion prompt dashboard and module prototype
- `docs/data/motion-modules.json`: motion module prompts, status, tags, and future snippets
- `docs/plans/14-day-outline.md`: the 14-day topic map
- `docs/journal/`: daily training notes, submissions, and feedback
- `docs/templates/day-note-template.md`: reusable note template
- `scripts/generate_site_index.py`: regenerate the site data after adding new day notes

## Usage

1. Open the current day note or create a new one from the template.
2. Write the day's goal, exercise output, and review answers.
3. Add coach feedback and next action before moving on.
4. Run `python3 scripts/generate_site_index.py` so the homepage picks up the latest day note.
5. Use `docs/motion-lab.html` for motion prompt experiments when the work shifts from daily notes to interactive prototypes.

## Local Preview

1. Run `python3 -m http.server 4173` from the repository root.
2. Open `http://localhost:4173/docs/`.

## GitHub Pages

This project is already configured to publish directly with GitHub Pages.

Current Pages configuration:

- Published site: <https://xuhailin.github.io/ui-ued-coach/>
- Source branch: `main`
- Source folder: `/docs`
- Site entry: `docs/index.html`
- Deployment workflow: GitHub's automatic `pages-build-deployment`

When local changes are ready to publish:

1. Commit the changed files.
2. Push to `origin/main`.
3. GitHub Pages will automatically run `pages-build-deployment` and publish the latest `/docs` content.

## GitHub Actions

GitHub Actions is enabled for this repository. There is no custom project CI workflow yet under `.github/workflows/`; the only active workflow is GitHub Pages' automatic `pages-build-deployment`.

That means the site deployment is working, but pushes will not run extra checks such as linting, tests, or index validation unless a custom workflow is added later.

## Current Status

- Day 1 has been initialized in `docs/journal/day-01-page-structure.md`.
- Homepage and Markdown viewer are available in `docs/`.
