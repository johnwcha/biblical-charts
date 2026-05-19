import { ChevronLeft, ChevronRight, MonitorUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Language } from '../types';
import { people } from '../data/adamToNoah';

interface PresentationViewProps {
  language: Language;
}

const steps = [
  ['adam', 'eve', 'cain', 'abel', 'seth'],
  ['enosh', 'kenan', 'mahalaleel'],
  ['jared', 'enoch', 'methuselah'],
  ['lamech', 'noah'],
];

export function PresentationView({ language }: PresentationViewProps) {
  const [step, setStep] = useState(0);
  const visibleIds = useMemo(() => new Set(steps.slice(0, step + 1).flat()), [step]);
  const visiblePeople = people.filter((person) => visibleIds.has(person.id));

  return (
    <main className="presentation">
      <div className="presentation-header">
        <p>
          <MonitorUp size={18} /> {language === 'en' ? 'Presentation View' : '簡報視圖'}
        </p>
        <div className="step-controls">
          <button onClick={() => setStep((value) => Math.max(0, value - 1))} aria-label="Previous reveal step">
            <ChevronLeft size={18} />
          </button>
          <span>
            {step + 1}/{steps.length}
          </span>
          <button onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))} aria-label="Next reveal step">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <section className="presentation-stage">
        {visiblePeople.map((person) => (
          <article className="presentation-person" key={person.id}>
            <strong>{person.displayName[language]}</strong>
            <span>{person.labels[0]?.[language]}</span>
            {person.ageAtDeath ? <small>{person.ageAtDeath} {language === 'en' ? 'years' : '年'}</small> : null}
          </article>
        ))}
      </section>
    </main>
  );
}
