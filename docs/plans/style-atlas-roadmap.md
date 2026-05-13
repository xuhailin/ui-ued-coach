# Style Atlas Roadmap

> Goal: build a dynamic layout-style preview system for UI/UED training.
> Core idea: the same content can be reorganized by different layout style models, and every page should know which style models are recommended, experimental, or risky for its content type.

## Status Legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Done
- `[!]` Blocked or needs decision

## Product Thesis

This project is not a theme switcher. It is a layout-style judgment system.

The system should help answer:

- What type of content is this interface presenting?
- Which layout style models fit this content best?
- Which styles are useful for exploration but risky for real delivery?
- How does the same content change when the layout model changes?

## Current Baseline

- `[x]` Viewer already supports multiple reading styles: Risograph, Terminal, Editorial, Motion Lab.
- `[x]` Existing Viewer styles change structure, not only color tokens.
- `[x]` Initial Style Atlas page exists at `docs/style-atlas.html`.
- `[x]` Style Atlas is linked from the home page and global rail.
- `[x]` Initial content types, style models, and compatibility matrix are represented in `docs/assets/style-atlas.js`.

## Phase 1 — Turn Style Atlas Into A Shared Registry

Purpose: move style knowledge out of one page and make it reusable by Viewer, Inspiration, Motion Lab, Docs, UI Kit, and Templates.

- `[x]` Create a shared registry file, likely `docs/assets/style-registry.js`.
- `[x]` Move content types from `style-atlas.js` into the shared registry.
- `[x]` Move style models from `style-atlas.js` into the shared registry.
- `[x]` Move compatibility scores into the shared registry.
- `[x]` Add page-to-content-type mapping:
  - Home / Inspiration: `gallery`
  - Viewer / learning outline: `article`, `course`
  - Motion Lab: `lab`
  - Style Atlas: `atlas`
  - Docs: `article`, `reference`
  - UI Kit: `component-library`
  - Templates: `template-library`
- `[x]` Refactor `style-atlas.js` to read from the shared registry.
- `[x]` Keep the Style Atlas page visually stable after refactor.

Acceptance criteria:

- Style Atlas renders from shared data.
- No duplicated style model definitions remain in `style-atlas.js`.
- Adding one style model in the registry is enough for the Style Atlas page to display it.

## Phase 2 — Add Style Judgment UI To Each Page

Purpose: every major page should explain what content type it is and which style models fit it.

- `[x]` Design a compact style switcher / judgment strip component.
- `[x]` Show current content type on the page.
- `[x]` Split styles into:
  - Recommended
  - Experimental
  - Risky / not recommended
- `[x]` Add short "why this fits" copy for each style option.
- `[x]` Add this strip to Inspiration.
- `[x]` Add this strip to Motion Lab.
- `[x]` Add this strip to Viewer.
- `[x]` Add this strip to Style Atlas itself as a self-reference.

Acceptance criteria:

- Users can tell why a page recommends certain style models.
- The UI does not feel like a marketing banner.
- The component is compact enough for app-like pages.

## Phase 3 — Inspiration Page Style Switching

Purpose: prove that style models work beyond reading pages.

Initial style candidates:

- Moodboard
- Magazine Grid
- Atlas Grid
- Console

Tasks:

- `[x]` Define Inspiration content schema: site name, url, description, tags, group, color, preview type.
- `[x]` Keep current grid as `Atlas Grid` or default gallery baseline.
- `[x]` Implement `Moodboard` layout: image/preview first, looser masonry-like rhythm, weaker text hierarchy.
- `[x]` Implement `Magazine Grid` layout: mixed card sizes, feature item, section rhythm.
- `[x]` Implement `Console` layout: dense module list, mono metadata, status-like tags.
- `[x]` Add style switcher that only shows styles compatible with `gallery`.
- `[x]` Store selected Inspiration style in localStorage.
- `[x]` Verify desktop and mobile layouts.

Acceptance criteria:

- Same inspiration data renders in at least three structurally different layouts.
- Moodboard feels image-first.
- Magazine Grid feels editorial/curated.
- Console feels like a structured module library, not just dark mode.

## Phase 4 — Motion Lab Style Switching

Purpose: test style models on interactive experiment content.

Initial style candidates:

- Console
- Dashboard
- Atlas Grid
- Terminal
- Showcase

Tasks:

- `[x]` Define Motion Lab content schema around modules, categories, implementation status, prompt, tags, preview.
- `[x]` Keep current Motion Lab as `Console`.
- `[x]` Implement `Dashboard` layout: stats first, category distribution, filtered module table/grid.
- `[x]` Implement `Atlas Grid` layout: categorized knowledge cards.
- `[x]` Implement `Terminal` layout: queue/status/log style presentation.
- `[x]` Decide whether `Showcase` should become a new style model in registry.
- `[x]` Ensure animation previews keep working across styles.
- `[x]` Pause heavy animation previews when hidden or offscreen.

Acceptance criteria:

- Motion Lab can switch style without breaking previews.
- Dashboard mode improves progress/status understanding.
- Atlas mode improves knowledge classification.

## Phase 5 — Viewer Registry Integration

Purpose: make the existing reading style system consistent with the global Style Atlas logic.

Tasks:

- `[x]` Map existing Viewer styles to registry models:
  - Editorial -> `editorial`
  - Terminal -> `terminal`
  - Motion Lab -> `console` or `motion-console`
  - Risograph -> decide whether it is a standalone style model or a visual variant.
- `[x]` Replace hardcoded Viewer style metadata with registry-driven metadata where reasonable.
- `[x]` Add recommended / experimental labels to Viewer style tabs.
- `[ ]` Keep existing copy-prompt behavior.
- `[x]` Add "why this style fits this document" helper copy.
- `[x]` Verify old Viewer URLs with `style=` still work.

Acceptance criteria:

- Viewer remains usable as a reading surface.
- Existing styles do not regress visually.
- Viewer participates in the same content-type/style-model system as other pages.

## Phase 6 — Expand The Model Library

Purpose: grow from a few page-specific examples into a reusable UI/UED learning atlas.

Candidate content types:

- `[ ]` Component Library
- `[ ]` Template Library
- `[ ]` Reference Document
- `[ ]` Flow / Journey
- `[ ]` Form Workflow
- `[ ]` Data Table
- `[ ]` Product Detail
- `[ ]` Campaign / Activity

Candidate style models:

- `[ ]` Linear-like SaaS
- `[ ]` Notion-like Document Workspace
- `[ ]` Apple-like Product Story
- `[ ]` High-density B-side Table
- `[ ]` Mobile App Home
- `[ ]` Campaign / Gamified
- `[ ]` Museum Wall
- `[ ]` Technical Spec Sheet

For each new style model, define:

- Layout strategy
- Visual strategy
- Suitable content types
- Risky content types
- Example pages
- Minimum viable preview

## Phase 7 — Authoring And Maintenance Workflow

Purpose: make it easy to add new style models without editing every page by hand.

- `[x]` Create a style model template in `docs/templates/`.
- `[x]` Create a content type template in `docs/templates/`.
- `[x]` Add a checklist for adding a style model.
- `[x]` Add a checklist for adding a page-level style preview.
- `[ ]` Consider generating a static registry summary into Style Atlas.
- `[x]` Document how to mark tasks done in this roadmap.

Progress rule: mark a roadmap item `[x]` only after the related UI or document exists locally and the page still loads. Keep verification-only items open until browser checks are complete.

Acceptance criteria:

- Future sessions can continue without re-reading the whole conversation.
- New style models have consistent metadata.
- Progress is visible in this roadmap.

## Open Decisions

- `[!]` Should Risograph be treated as a full layout style model or a visual variant of editorial/card reading?
- `[!]` Should Motion Console be separate from generic Console?
- `[!]` Should style switching be global across pages or page-local?
- `[!]` Should incompatible styles be hidden, disabled, or shown under "experimental"?
- `[!]` Should the Style Atlas become the data source only, or also remain a learning/teaching page?

## Near-Term Next Session Plan

Recommended next batch:

1. Extract `style-registry.js`.
2. Refactor `style-atlas.js` to consume the registry.
3. Add a compact style judgment strip to Inspiration.
4. Implement one additional Inspiration layout, preferably `Moodboard`.
5. Mark completed tasks in this file.
