import { BookMarked, CircleHelp, Clock3 } from 'lucide-react';
import type { Language, Person, Relationship } from '../types';

interface PersonDetailPanelProps {
  person: Person;
  language: Language;
  relationships: Relationship[];
}

export function PersonDetailPanel({ person, language, relationships }: PersonDetailPanelProps) {
  const relatedCount = relationships.filter(
    (relationship) => relationship.sourcePersonId === person.id || relationship.targetPersonId === person.id,
  ).length;

  return (
    <aside className="detail-panel" aria-label="Person details">
      <div className="detail-header">
        <p className="eyebrow">{language === 'en' ? 'Selected Person' : '所選人物'}</p>
        <h2>{person.displayName[language]}</h2>
      </div>

      <p className="detail-summary">{person.summary[language]}</p>

      <dl className="fact-list">
        <div>
          <dt>
            <Clock3 size={16} /> {language === 'en' ? 'Lifespan' : '壽命'}
          </dt>
          <dd>
            {person.ageAtDeath
              ? `${person.ageAtDeath} ${language === 'en' ? 'years' : '年'}`
              : language === 'en'
                ? 'Not stated in V1 data'
                : 'V1 資料未記載'}
          </dd>
        </div>
        <div>
          <dt>
            <CircleHelp size={16} /> {language === 'en' ? 'Connections' : '關係'}
          </dt>
          <dd>{relatedCount}</dd>
        </div>
      </dl>

      <section className="refs">
        <h3>
          <BookMarked size={16} /> {language === 'en' ? 'Scripture References' : '經文出處'}
        </h3>
        <ul>
          {person.scriptureRefs.map((ref) => (
            <li key={`${ref.display}-${ref.translation}`}>{ref.display}</li>
          ))}
        </ul>
      </section>

      {person.sourceNotes ? <p className="source-note">{person.sourceNotes}</p> : null}
    </aside>
  );
}
