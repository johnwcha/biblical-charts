import { readFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import ts from 'typescript';

const DATA_FILE = new URL('../src/data/adamToNoah.ts', import.meta.url);
const LANGUAGES = ['en', 'zh-Hant'];
const MOJIBAKE_PATTERN = /[\u00c3\u00c2\ufffd]|(?:[\u00e8\u00e5\u00e7\u00e6\u00e4][\u0080-\u00ff])/;

const failures = [];

function fail(message) {
  failures.push(message);
}

function assertLocalizedText(value, path) {
  if (!value || typeof value !== 'object') {
    fail(`${path} must be a localized text object`);
    return;
  }

  for (const language of LANGUAGES) {
    const text = value[language];
    if (typeof text !== 'string' || text.trim().length === 0) {
      fail(`${path}.${language} must be present`);
      continue;
    }

    if (MOJIBAKE_PATTERN.test(text)) {
      fail(`${path}.${language} appears to contain mojibake: ${text}`);
    }
  }
}

function assertRefs(refs, path) {
  if (!Array.isArray(refs) || refs.length === 0) {
    fail(`${path} must include at least one Scripture reference`);
    return;
  }

  refs.forEach((ref, index) => {
    if (ref.book !== 'Genesis') fail(`${path}[${index}].book should be Genesis for V1 Adam-to-Noah data`);
    if (!Number.isInteger(ref.chapter) || ref.chapter < 1) fail(`${path}[${index}].chapter must be positive`);
    if (!Number.isInteger(ref.verseStart) || ref.verseStart < 1) fail(`${path}[${index}].verseStart must be positive`);
    if (ref.verseEnd !== undefined && ref.verseEnd < ref.verseStart) {
      fail(`${path}[${index}].verseEnd must be >= verseStart`);
    }
    if (typeof ref.display !== 'string' || ref.display.trim().length === 0) fail(`${path}[${index}].display is required`);
  });
}

function assertUniqueIds(items, label) {
  const seen = new Set();
  for (const item of items) {
    if (!item.id) {
      fail(`${label} item is missing an id`);
      continue;
    }
    if (seen.has(item.id)) fail(`${label} id is duplicated: ${item.id}`);
    seen.add(item.id);
  }
}

async function loadDataModule() {
  const source = await readFile(DATA_FILE, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
      importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Remove,
    },
  });

  const encoded = Buffer.from(output.outputText, 'utf8').toString('base64');
  return import(`data:text/javascript;base64,${encoded}`);
}

const { adamToNoahChart, people, relationships, timelineEvents } = await loadDataModule();

assertLocalizedText(adamToNoahChart.title, 'chart.title');
assertLocalizedText(adamToNoahChart.description, 'chart.description');

assertUniqueIds(people, 'person');
assertUniqueIds(relationships, 'relationship');
assertUniqueIds(timelineEvents, 'timeline event');

const personIds = new Set(people.map((person) => person.id));

for (const person of people) {
  assertLocalizedText(person.displayName, `person.${person.id}.displayName`);
  assertLocalizedText(person.summary, `person.${person.id}.summary`);

  if (!Array.isArray(person.labels) || person.labels.length === 0) {
    fail(`person.${person.id}.labels must include at least one label`);
  } else {
    person.labels.forEach((label, index) => assertLocalizedText(label, `person.${person.id}.labels[${index}]`));
  }

  assertRefs(person.scriptureRefs, `person.${person.id}.scriptureRefs`);

  if (person.birthYearApprox !== undefined || person.deathYearApprox !== undefined || person.ageAtDeath !== undefined) {
    if (!Number.isInteger(person.birthYearApprox) || !Number.isInteger(person.deathYearApprox)) {
      fail(`person.${person.id} must include both birthYearApprox and deathYearApprox when timeline data exists`);
    } else if (person.ageAtDeath !== undefined && person.deathYearApprox - person.birthYearApprox !== person.ageAtDeath) {
      fail(`person.${person.id} lifespan math does not match birth/death offsets`);
    }
  }
}

for (const relationship of relationships) {
  if (!personIds.has(relationship.sourcePersonId)) {
    fail(`relationship.${relationship.id} has unknown sourcePersonId: ${relationship.sourcePersonId}`);
  }
  if (!personIds.has(relationship.targetPersonId)) {
    fail(`relationship.${relationship.id} has unknown targetPersonId: ${relationship.targetPersonId}`);
  }
  assertRefs(relationship.scriptureRefs, `relationship.${relationship.id}.scriptureRefs`);
  if (relationship.notes) assertLocalizedText(relationship.notes, `relationship.${relationship.id}.notes`);
}

for (const event of timelineEvents) {
  assertLocalizedText(event.title, `timelineEvent.${event.id}.title`);
  assertRefs(event.scriptureRefs, `timelineEvent.${event.id}.scriptureRefs`);
  for (const personId of event.people) {
    if (!personIds.has(personId)) fail(`timelineEvent.${event.id} references unknown person: ${personId}`);
  }
}

if (failures.length > 0) {
  console.error(`Data validation failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Data validation passed: ${people.length} people, ${relationships.length} relationships, ${timelineEvents.length} timeline events.`);
