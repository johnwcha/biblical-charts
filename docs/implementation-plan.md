# Biblical Charts Atlas - Implementation Plan

## 1. Product Summary

Build a mobile-friendly, read-only web app for personal Bible study and church teaching. The app will display interactive biblical charts, beginning with an Adam-to-Noah genealogy and expanding into timelines, maps, book outlines, prophecy charts, temple/tabernacle diagrams, and topic charts.

The visual direction is **Modern Study Tool + Illustrated Bible Atlas accents**:

- Clean study-app structure for repeated personal use.
- Clear teaching-friendly layouts for church projection.
- Subtle parchment, atlas, and map-inspired visual accents.
- Interactive charts with pan, zoom, search, detail panels, and language toggles.
- Mobile-first responsiveness without sacrificing desktop teaching use.

V1 should prove the data model, visual language, and interaction patterns through one polished chart: **Adam to Noah**.

## 2. Locked Decisions

### Audience

- Personal study.
- Church teaching.
- Future classroom or small-group use should be supported by the same design patterns.

### Scope

V1 includes:

- Chart gallery shell.
- Adam-to-Noah interactive genealogy.
- Person detail panel.
- Lifespan/timeline view for Genesis 5.
- Presentation mode.
- English/Chinese toggle.
- Source/attribution page.

Future chart categories:

- Family trees.
- Timelines.
- Maps.
- Book outlines.
- Prophecy charts.
- Temple/tabernacle diagrams.
- Topic charts.
- Kings and prophets.
- Covenants.
- Feasts and festivals.
- Journeys of Paul.
- Miracles and parables of Jesus.

### Bible Text

- Default English text: **King James Version (KJV)**.
- Chinese text: **Chinese Union Version Traditional** first.
- Canon: **Protestant 66-book canon** for V1.

### Content Policy

- Keep notes factual and Scripture-reference based.
- Do not include doctrinal or denominational commentary in V1.
- Show uncertain or traditional possibilities only when visually marked and labeled as uncertain.
- Explicit biblical relationships must be visually distinct from uncertain/traditional relationships.
- Read-only app for V1: no accounts, saved notes, or bookmarks.

### Teaching Mode

Include a presentation view with:

- Large labels.
- Step-by-step generation reveal.
- Fullscreen-friendly layout.
- Minimal controls.
- Projector-friendly contrast.
- Mobile/tablet usability.

## 3. Data Source Decision

### Primary Scripture Text Source

Use **eBible public-domain Scripture sources** for KJV and Chinese Union Version where possible.

Reasoning:

- eBible lists KJV and Chinese Union Version among public-domain Bibles in the USA.
- eBible provides developer-friendly formats for Scripture data.
- KJV and Chinese Union Version align with the requested English/Chinese experience.
- eBible is more directly Scripture-text focused than broad aggregated datasets.

Relevant sources:

- <https://ebible.org/Scriptures/copyright.php>
- <https://ebible.org/bible/details.php?id=cmn-cu89s>

### Primary Structured Bible Data Source

Use **BibleData by Brady Stephenson** as the seed source for structured people, labels, relationships, references, dictionary data, places, and later event data.

Reasoning:

- It includes `BibleData-Person.csv`, `BibleData-PersonRelationship.csv`, `BibleData-PersonLabel.csv`, `BibleData-Reference.csv`, and other relevant structured files.
- It is actively maintained and has a 2026 Version 1.0 release.
- It is licensed under **Creative Commons Attribution 4.0 International (CC BY 4.0)**.
- It is designed for structured biblical analysis and includes people, relationships, places, verses, names, Strong's references, and topical/dictionary material.

Relevant source:

- <https://github.com/BradyStephenson/bible-data>

### Supporting Source

Use `scrollmapper/bible_databases` only as a secondary reference or fallback for Bible text/cross-reference data.

Reasoning:

- It has many translations and formats.
- It is MIT licensed.
- It includes KJV and Chinese Union Version entries.
- Its breadth is useful, but for this project eBible is cleaner for Scripture text and BibleData is better for structured people/relationship data.

Relevant source:

- <https://github.com/scrollmapper/bible_databases>

### V1 Data Quality Rule

The Adam-to-Noah chart must be manually verified against Genesis 4-5 before being treated as teaching-ready.

BibleData may be used as a seed, but V1 display data should be curated into local static JSON with explicit source references. The app should not blindly render imported relationship data as authoritative.

## 4. Recommended Technical Stack

### Frontend

- React.
- Vite.
- TypeScript.
- CSS modules or plain CSS with well-organized custom properties.

### Charting

- React Flow for interactive genealogies.
- ELK.js or Dagre for automatic graph layout if needed.
- D3-compatible data structures for future timeline and topic charts.

### Maps

- Leaflet-compatible place/event model for future map charts.
- Map implementation can wait until the genealogy foundation is stable.

### Data

- Static JSON data in V1.
- No backend in V1.
- No user authentication in V1.
- Future-ready data model should support import from CSV sources.

## 5. Core Data Model

### Person

Fields:

- `id`
- `displayName`
- `names`
- `gender`
- `birthYearApprox`
- `deathYearApprox`
- `ageAtDeath`
- `ageAtNamedChild`
- `scriptureRefs`
- `labels`
- `summary`
- `sourceNotes`

### Relationship

Fields:

- `id`
- `sourcePersonId`
- `targetPersonId`
- `type`
- `certainty`
- `scriptureRefs`
- `notes`

Allowed certainty values:

- `explicit`
- `inferred`
- `traditional`
- `uncertain`

### VerseRef

Fields:

- `book`
- `chapter`
- `verseStart`
- `verseEnd`
- `translation`
- `display`

### ChartDefinition

Fields:

- `id`
- `title`
- `category`
- `description`
- `defaultView`
- `dataSource`
- `availableViews`

### TimelineEvent

Fields:

- `id`
- `title`
- `dateApprox`
- `dateRange`
- `people`
- `places`
- `scriptureRefs`
- `certainty`

## 6. V1 Adam-To-Noah Data

Include these people at minimum:

- Adam.
- Eve.
- Cain.
- Abel.
- Seth.
- Enosh.
- Kenan.
- Mahalaleel.
- Jared.
- Enoch.
- Methuselah.
- Lamech.
- Noah.

Include these relationship groups:

- Adam and Eve.
- Adam/Eve to Cain, Abel, and Seth.
- Seth to Enosh.
- Enosh to Kenan.
- Kenan to Mahalaleel.
- Mahalaleel to Jared.
- Jared to Enoch.
- Enoch to Methuselah.
- Methuselah to Lamech.
- Lamech to Noah.

Include lifespan details from Genesis 5:

- Adam: 930 years.
- Seth: 912 years.
- Enosh: 905 years.
- Kenan: 910 years.
- Mahalaleel: 895 years.
- Jared: 962 years.
- Enoch: 365 years, with distinct treatment because Genesis says God took him.
- Methuselah: 969 years.
- Lamech: 777 years.
- Noah: 500 years old when Shem, Ham, and Japheth are introduced; 600 at the flood; 950 total lifespan.

The app should calculate approximate Anno Mundi-style year offsets for the lifespan overlap view from the Genesis 5 father-age data. These should be shown as study aids, not as absolute modern calendar dates.

## 7. App Views

### Chart Gallery

Purpose:

- Entry screen for all chart categories.
- V1 should show Adam-to-Noah as the available chart and future categories as inactive or coming-later sections.

Behavior:

- Search/filter by chart type.
- Clear category labels.
- No marketing-style landing page.

### Genealogy Viewer

Purpose:

- Main interactive Adam-to-Noah family tree.

Required interactions:

- Pan.
- Zoom.
- Fit-to-screen.
- Search person.
- Click node to open details.
- Toggle English/Traditional Chinese labels.
- Toggle compact genealogy view and timeline genealogy view.
- Toggle explicit-only relationships vs include uncertain/traditional possibilities.

### Person Detail Panel

Purpose:

- Show factual details for selected person.

Required content:

- Name.
- Chinese name when available.
- Lifespan details.
- Relationship summary.
- Scripture references.
- Brief factual summary.
- Certainty/source notes where relevant.

### Lifespan Timeline

Purpose:

- Show Genesis 5 lifespan overlaps.

Required behavior:

- Horizontal bars by person.
- Approximate year offsets from Adam's creation/birth.
- Highlight selected person.
- Keep labels readable on mobile.

### Presentation View

Purpose:

- Church teaching/projection mode.

Required behavior:

- Large readable nodes.
- Fullscreen-friendly chart.
- Step reveal by generation.
- Minimal UI chrome.
- Keyboard or button controls for previous/next step.
- English/Chinese toggle remains available.

### Sources/About

Purpose:

- Credit data sources and explain data policy.

Required content:

- eBible attribution.
- BibleData attribution and CC BY 4.0 notice.
- Mention manual verification of V1 Adam-to-Noah data.
- Explain uncertainty labels.

## 8. Visual Design Requirements

### Overall Feel

- Modern study interface.
- Atlas-inspired, but not decorative-heavy.
- Calm, readable, teaching-friendly.

### Color Direction

- Light parchment/off-white background.
- Muted greens for lineage lines.
- Warm neutral panels.
- One restrained accent color for selection/highlight.
- Avoid a one-note beige-only palette by adding restrained green, ink, and blue accents.

### Layout

- No nested UI cards.
- Do not build a marketing landing page.
- First screen should be the usable chart gallery.
- Chart canvases should feel spacious and practical.
- Controls should be compact and recognizable.

### Responsive Rules

- Mobile-first layout.
- Side panel becomes a bottom sheet or full-width detail area on small screens.
- Text must not overlap nodes or controls.
- Buttons must keep stable dimensions.
- Chart controls must remain reachable on touch devices.

## 9. Implementation Phases

### Phase 1 - Documentation And Scaffold

- Save this implementation plan.
- Create Vite React TypeScript app.
- Add baseline project scripts.
- Add basic folder structure for components, data, views, and types.

### Phase 2 - Data Foundation

- Create local static JSON for Adam-to-Noah people and relationships.
- Create translation label fields for English and Traditional Chinese.
- Add Scripture reference structures.
- Add source/attribution metadata.

### Phase 3 - Genealogy Viewer

- Render interactive tree with React Flow.
- Add auto layout.
- Add pan/zoom controls.
- Add person node component.
- Add relationship styling for explicit vs uncertain.

### Phase 4 - Study Interactions

- Add search.
- Add selected-person detail panel.
- Add language toggle.
- Add certainty toggle.
- Add compact/timeline tree toggle.

### Phase 5 - Lifespan Timeline

- Calculate Genesis 5 approximate year offsets.
- Render lifespan overlap chart.
- Connect timeline selection to selected person.

### Phase 6 - Presentation Mode

- Add presentation route or mode.
- Add generation-step reveal.
- Add large-node layout.
- Add minimal controls.

### Phase 7 - Polish And Verification

- Responsive pass for desktop, tablet, and mobile.
- Accessibility pass for keyboard and contrast.
- Build/typecheck.
- Manual source verification pass.

## 10. Testing And Acceptance Criteria

### Functional Tests

- Adam-to-Noah chart renders without errors.
- Pan and zoom work.
- Fit-to-screen works.
- Search selects or highlights the right person.
- Clicking a person opens correct details.
- Language toggle switches visible labels.
- Certainty toggle hides/shows non-explicit relationships.
- Compact/timeline tree toggle changes view without losing selection.
- Presentation mode reveals generations step by step.
- Lifespan timeline displays expected Genesis 5 lifespan bars.

### Data Tests

- Every displayed factual claim has at least one Scripture reference or source note.
- Explicit relationships in V1 are verified against Genesis 4-5.
- Uncertain/traditional relationships are not styled as explicit.
- KJV references are the default English reference display.
- Traditional Chinese labels/text appear where available.

### Responsive Tests

- Desktop layout is usable at 1440px wide.
- Tablet layout is usable around 768px wide.
- Mobile layout is usable around 390px wide.
- No control text overlaps.
- Node labels remain readable.
- Detail panel does not cover essential controls in an unusable way.

### Build Tests

- `npm run build` passes.
- TypeScript checks pass.
- No console errors during initial app load.

## 11. Future Expansion Plan

After V1, add chart modules in this order:

1. Noah's descendants and Table of Nations.
2. Abraham's family.
3. Jacob's sons and tribes of Israel.
4. Kings of Israel and Judah.
5. Prophets timeline.
6. Jesus' genealogy.
7. Journeys of Paul.
8. Tabernacle and temple diagrams.
9. Book outlines.
10. Topic charts and prophecy charts.

Each new module should reuse:

- `Person`
- `Relationship`
- `VerseRef`
- `ChartDefinition`
- `TimelineEvent`
- Shared source/attribution metadata

## 12. Open Implementation Notes

- Do not add doctrinal commentary unless a later requirement explicitly asks for it.
- Do not add user accounts or persistence in V1.
- Keep import tooling separate from curated app data.
- Treat generated/imported data as drafts until manually reviewed.
- Keep the app designed for both individual study and live teaching.
