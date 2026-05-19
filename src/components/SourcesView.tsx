import type { Language } from '../types';

export function SourcesView({ language }: { language: Language }) {
  return (
    <main className="sources-view">
      <div className="section-heading">
        <p className="eyebrow">{language === 'en' ? 'Sources' : '資料來源'}</p>
        <h1>{language === 'en' ? 'Data and Attribution' : '資料與署名'}</h1>
      </div>

      <section className="source-block">
        <h2>Scripture Text</h2>
        <p>
          V1 is planned around public-domain KJV and Chinese Union Version sources from eBible. Displayed V1 genealogy claims
          are manually curated from Genesis 4-5 before being treated as teaching-ready.
        </p>
        <a href="https://ebible.org/Scriptures/copyright.php" target="_blank" rel="noreferrer">
          eBible copyright information
        </a>
      </section>

      <section className="source-block">
        <h2>Structured Data Seed</h2>
        <p>
          BibleData by Brady Stephenson is the planned structured seed source for people, relationships, references, and
          later chart modules. It is licensed CC BY 4.0 and should be attributed in imported datasets.
        </p>
        <a href="https://github.com/BradyStephenson/bible-data" target="_blank" rel="noreferrer">
          BibleData repository
        </a>
      </section>

      <section className="source-block">
        <h2>Uncertainty Labels</h2>
        <p>
          Relationships marked inferred, traditional, or uncertain are study aids and should remain visually distinct from
          explicit relationships.
        </p>
      </section>
    </main>
  );
}
