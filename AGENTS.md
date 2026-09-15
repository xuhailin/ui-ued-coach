# UI/UED Coach Project Rules

## Working Mode

- This project is for daily UI/UED coaching notes and lightweight learning artifacts.
- Keep the scope narrow: one day, one topic, one exercise, one review.
- Prefer short, actionable writing over long theory dumps.

## Documentation Rules

- Save each training day as one file under `docs/journal/`.
- Keep the 14-day roadmap in `docs/plans/14-day-outline.md`.
- When adding feedback, separate `User Submission` and `Coach Feedback`.
- Do not skip to the next day unless the previous day is marked complete.

## Knowledge Ownership

- This is a personal learning repository. Keep company work knowledge in the company work-base, including internal environments, service identifiers, business schemas, and work incident/debugging notes.
- Classify notes by their source and ownership before adding them. Rephrasing a work case as a reusable knowledge card does not make it personal learning material.
- When moving misplaced work material out, remove its source and all generated index entries; regenerate `docs/data/site-index.json` and check tracked files for remaining copies or references before committing.

## Editing Rules

- Use Markdown only unless the user explicitly wants a runnable demo.
- Avoid heavy scaffolding unless the user asks for a full app.
- Preserve user writing; add comments and revisions without deleting original meaning.
