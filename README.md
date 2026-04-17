# UI/UED Coach Workspace

This workspace is a lightweight home for a 14-day UI/UED training track aimed at frontend developers.

## Purpose

- Keep the daily coaching plan in one place
- Store practice records and feedback
- Accumulate page analysis notes and design judgment over time

## Structure

- `AGENTS.md`: working rules for the coaching thread
- `docs/index.html`: local homepage and GitHub Pages entry
- `docs/plans/14-day-outline.md`: the 14-day topic map
- `docs/journal/`: daily training notes, submissions, and feedback
- `docs/templates/day-note-template.md`: reusable note template
- `scripts/generate_site_index.py`: regenerate the site data after adding new day notes

## Usage

1. Open the current day note or create a new one from the template.
2. Write the day's goal, exercise output, and review answers.
3. Add coach feedback and next action before moving on.
4. Run `python3 scripts/generate_site_index.py` so the homepage picks up the latest day note.

## Local Preview

1. Run `python3 -m http.server 4173` from the repository root.
2. Open `http://localhost:4173/docs/`.

## GitHub Pages

This project can go directly on GitHub Pages.

1. Push the repository to GitHub.
2. In repository settings, enable Pages from the `main` branch and `/docs` folder.
3. The published site entry will be `docs/index.html`.

## Current Status

- Day 1 has been initialized in `docs/journal/day-01-page-structure.md`.
- Homepage and Markdown viewer are available in `docs/`.
