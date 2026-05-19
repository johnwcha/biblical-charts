import type { Language } from '../types';
import { people } from '../data/adamToNoah';
import { getTimelineMax, getTimelinePeople } from '../utils/timeline';

interface LifespanTimelineProps {
  language: Language;
  selectedPersonId: string;
  onSelectPerson: (personId: string) => void;
}

export function LifespanTimeline({ language, selectedPersonId, onSelectPerson }: LifespanTimelineProps) {
  const timelinePeople = getTimelinePeople(people);
  const max = getTimelineMax(people);

  return (
    <section className="timeline-panel" aria-label="Lifespan overlap timeline">
      <div className="section-heading">
        <p className="eyebrow">{language === 'en' ? 'Genesis 5 Timeline' : '創世記五章時間線'}</p>
        <h2>{language === 'en' ? 'Lifespan Overlap' : '壽命重疊'}</h2>
      </div>

      <div className="timeline-bars">
        {timelinePeople.map((person) => {
          const start = person.birthYearApprox ?? 0;
          const end = person.deathYearApprox ?? start;
          const left = (start / max) * 100;
          const width = ((end - start) / max) * 100;

          return (
            <button
              className={`timeline-row ${selectedPersonId === person.id ? 'timeline-row-selected' : ''}`}
              key={person.id}
              onClick={() => onSelectPerson(person.id)}
            >
              <span className="timeline-name">{person.displayName[language]}</span>
              <span className="timeline-track">
                <span className="timeline-bar" style={{ left: `${left}%`, width: `${width}%` }} />
              </span>
              <span className="timeline-years">
                {start}-{end}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
