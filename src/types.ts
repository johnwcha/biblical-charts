export type Language = 'en' | 'zh-Hant';

export type Certainty = 'explicit' | 'inferred' | 'traditional' | 'uncertain';

export type ViewMode = 'compact' | 'timeline';

export type AppView = 'gallery' | 'genealogy' | 'presentation' | 'sources';

export interface LocalizedText {
  en: string;
  'zh-Hant': string;
}

export interface VerseRef {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  translation: 'KJV' | 'CUV';
  display: string;
}

export interface Person {
  id: string;
  displayName: LocalizedText;
  gender: 'male' | 'female' | 'unknown';
  birthYearApprox?: number;
  deathYearApprox?: number;
  ageAtDeath?: number;
  ageAtNamedChild?: number;
  labels: LocalizedText[];
  summary: LocalizedText;
  scriptureRefs: VerseRef[];
  sourceNotes?: string;
}

export interface Relationship {
  id: string;
  sourcePersonId: string;
  targetPersonId: string;
  type: 'spouse' | 'parent-child';
  certainty: Certainty;
  scriptureRefs: VerseRef[];
  notes?: LocalizedText;
}

export interface TimelineEvent {
  id: string;
  title: LocalizedText;
  dateApprox: number;
  people: string[];
  scriptureRefs: VerseRef[];
  certainty: Certainty;
}

export interface ChartDefinition {
  id: string;
  title: LocalizedText;
  category: string;
  description: LocalizedText;
  defaultView: ViewMode;
  availableViews: ViewMode[];
}
