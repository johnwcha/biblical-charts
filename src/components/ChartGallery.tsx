import { BookOpen, GitBranch, Map, ScrollText, Sparkles } from 'lucide-react';
import type { ChartDefinition, Language } from '../types';

interface ChartGalleryProps {
  chart: ChartDefinition;
  language: Language;
  onOpenChart: () => void;
}

const comingSoon = [
  { icon: GitBranch, title: 'Noah and the Nations', titleZh: '挪亞與列國' },
  { icon: Map, title: 'Journeys and Places', titleZh: '旅程與地點' },
  { icon: ScrollText, title: 'Book Outlines', titleZh: '書卷大綱' },
  { icon: Sparkles, title: 'Prophecy Charts', titleZh: '預言圖表' },
];

export function ChartGallery({ chart, language, onOpenChart }: ChartGalleryProps) {
  return (
    <main className="gallery">
      <section className="gallery-intro">
        <div>
          <p className="eyebrow">{language === 'en' ? 'Biblical Charts Atlas' : '聖經圖表圖集'}</p>
          <h1>{language === 'en' ? 'Study Scripture through connected charts.' : '用互相關聯的圖表研讀聖經。'}</h1>
        </div>
        <p>
          {language === 'en'
            ? 'Start with the curated Adam-to-Noah genealogy, then expand into timelines, maps, outlines, and teaching views.'
            : '先從經過整理的亞當至挪亞家譜開始，之後擴展至時間線、地圖、大綱與教學視圖。'}
        </p>
      </section>

      <section className="chart-grid" aria-label="Available charts">
        <button className="chart-card chart-card-active" onClick={onOpenChart}>
          <span className="chart-icon">
            <BookOpen size={24} />
          </span>
          <span>
            <strong>{chart.title[language]}</strong>
            <small>{chart.description[language]}</small>
          </span>
        </button>

        {comingSoon.map((item) => {
          const Icon = item.icon;
          return (
            <div className="chart-card chart-card-muted" key={item.title}>
              <span className="chart-icon">
                <Icon size={24} />
              </span>
              <span>
                <strong>{language === 'en' ? item.title : item.titleZh}</strong>
                <small>{language === 'en' ? 'Planned module' : '規劃中的模組'}</small>
              </span>
            </div>
          );
        })}
      </section>
    </main>
  );
}
