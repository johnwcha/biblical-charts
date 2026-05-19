import { BookOpen, Languages, MonitorUp, Network, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ChartGallery } from './components/ChartGallery';
import { GenealogyViewer } from './components/GenealogyViewer';
import { LifespanTimeline } from './components/LifespanTimeline';
import { PersonDetailPanel } from './components/PersonDetailPanel';
import { PresentationView } from './components/PresentationView';
import { SourcesView } from './components/SourcesView';
import { adamToNoahChart, people, relationships } from './data/adamToNoah';
import type { AppView, Language, ViewMode } from './types';

export function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [view, setView] = useState<AppView>('gallery');
  const [selectedPersonId, setSelectedPersonId] = useState('adam');
  const [viewMode, setViewMode] = useState<ViewMode>('compact');
  const [showUncertain, setShowUncertain] = useState(true);

  const selectedPerson = useMemo(
    () => people.find((person) => person.id === selectedPersonId) ?? people[0],
    [selectedPersonId],
  );

  const openGenealogy = () => setView('genealogy');

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setView('gallery')}>
          <BookOpen size={22} />
          <span>{language === 'en' ? 'Biblical Charts Atlas' : '聖經圖表圖集'}</span>
        </button>

        <nav className="nav-tabs" aria-label="Primary">
          <button className={view === 'gallery' ? 'active' : ''} onClick={() => setView('gallery')}>
            {language === 'en' ? 'Gallery' : '圖集'}
          </button>
          <button className={view === 'genealogy' ? 'active' : ''} onClick={openGenealogy}>
            <Network size={16} /> {language === 'en' ? 'Genealogy' : '家譜'}
          </button>
          <button className={view === 'presentation' ? 'active' : ''} onClick={() => setView('presentation')}>
            <MonitorUp size={16} /> {language === 'en' ? 'Present' : '簡報'}
          </button>
          <button className={view === 'sources' ? 'active' : ''} onClick={() => setView('sources')}>
            <ShieldCheck size={16} /> {language === 'en' ? 'Sources' : '來源'}
          </button>
        </nav>

        <button className="language-toggle" onClick={() => setLanguage(language === 'en' ? 'zh-Hant' : 'en')}>
          <Languages size={16} />
          {language === 'en' ? '中文' : 'English'}
        </button>
      </header>

      {view === 'gallery' ? (
        <ChartGallery chart={adamToNoahChart} language={language} onOpenChart={openGenealogy} />
      ) : null}

      {view === 'genealogy' ? (
        <main className="study-layout">
          <section className="study-header">
            <div>
              <p className="eyebrow">{language === 'en' ? 'Interactive Genealogy' : '互動家譜'}</p>
              <h1>{adamToNoahChart.title[language]}</h1>
            </div>
            <div className="control-row">
              <button className={viewMode === 'compact' ? 'active' : ''} onClick={() => setViewMode('compact')}>
                {language === 'en' ? 'Compact' : '緊湊'}
              </button>
              <button className={viewMode === 'timeline' ? 'active' : ''} onClick={() => setViewMode('timeline')}>
                {language === 'en' ? 'Timeline Tree' : '時間線'}
              </button>
              <label className="toggle-control">
                <input
                  type="checkbox"
                  checked={showUncertain}
                  onChange={(event) => setShowUncertain(event.target.checked)}
                />
                {language === 'en' ? 'Show uncertain' : '顯示不確定'}
              </label>
            </div>
          </section>

          <div className="study-grid">
            <div className="main-column">
              <GenealogyViewer
                language={language}
                selectedPersonId={selectedPersonId}
                viewMode={viewMode}
                showUncertain={showUncertain}
                onSelectPerson={setSelectedPersonId}
              />
              <LifespanTimeline
                language={language}
                selectedPersonId={selectedPersonId}
                onSelectPerson={setSelectedPersonId}
              />
            </div>
            <PersonDetailPanel person={selectedPerson} language={language} relationships={relationships} />
          </div>
        </main>
      ) : null}

      {view === 'presentation' ? <PresentationView language={language} /> : null}
      {view === 'sources' ? <SourcesView language={language} /> : null}
    </div>
  );
}
