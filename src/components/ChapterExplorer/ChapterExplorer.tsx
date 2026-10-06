import { useEffect, useRef, useState } from 'react';
import { Text } from '../Text/Text';
import { blocksByChapter, type Block, type Chapter } from '../../data/study';
import './ChapterExplorer.css';

/**
 * 장 목록 — BI 커리큘럼(CourseExplorer)의 줄 모양을 그대로: 줄을 누르면 아래로 상세가 펼쳐진다.
 * 줄: 번호 · 한글 장 이름(크게) · 영문 이름 · 한 줄 정의 / 오른쪽에 쪽수 · 주차 캡슐.
 * 상세: 왼쪽 요약 · 핵심 개념 · 헷갈리기 쉬운 점 · 질문 | 오른쪽 장 정보 · 내 아카이브 예시.
 * 섹션이 처음 화면에 들어오면 맨 위 장이 스스로 펼쳐진다(그 전에 먼저 눌렀다면 건드리지 않는다).
 */
type Props = { chapters: Chapter[]; onOpenBlock: (block: Block) => void };

const partLabel = { process: '디자인 과정', principle: '디자인 원리', element: '디자인 요소' } as const;

export function ChapterExplorer({ chapters, onOpenBlock }: Props) {
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const touched = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const first = chapters[0]?.id;
    if (!root || !first) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (!touched.current) setOpen(new Set([first]));
      },
      { rootMargin: '0px 0px -25% 0px' },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [chapters]);

  // 다른 곳(용어집 · 블록 상세)에서 장으로 건너오면 그 장을 펼친다
  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (!chapters.some((c) => c.id === id)) return;
      touched.current = true;
      setOpen((prev) => new Set(prev).add(id));
    };
    window.addEventListener('al:open-chapter', onOpen);
    return () => window.removeEventListener('al:open-chapter', onOpen);
  }, [chapters]);

  const toggle = (id: string) => {
    touched.current = true;
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div ref={rootRef} className="chapter-explorer">
      <ul className="chapter-rows">
        {chapters.map((ch) => (
          <ChapterRow key={ch.id} chapter={ch} open={open.has(ch.id)} onToggle={() => toggle(ch.id)} onOpenBlock={onOpenBlock} />
        ))}
      </ul>
    </div>
  );
}

function ChapterRow({ chapter: ch, open, onToggle, onOpenBlock }: { chapter: Chapter; open: boolean; onToggle: () => void; onOpenBlock: (b: Block) => void }) {
  const panelId = `chapter-detail-${ch.id}`;
  return (
    <li id={`chapter-${ch.id}`} className="chapter-row" data-open={open}>
      <button type="button" className="chapter-row__hit" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
        <span className="chapter-row__no">{String(ch.no).padStart(2, '0')}</span>
        <span className="chapter-row__text">
          <span className="chapter-row__title">
            <span className="chapter-row__name">{ch.ko}</span>
            <span className="chapter-row__en">{ch.en}</span>
          </span>
          <span className="chapter-row__meta">{ch.oneLine}</span>
        </span>
        <span className="chapter-row__tags">
          {ch.weeks?.map((w) => (
            <span key={w} className="chapter-row__tag chapter-row__tag--week">{w}</span>
          ))}
          <span className="chapter-row__tag">p.{ch.pages[0]}–{ch.pages[1]}</span>
        </span>
        <span className="chapter-row__chevron" aria-hidden="true" />
      </button>

      <div id={panelId} className="chapter-row__panel" role="region" aria-label={`${ch.ko} 상세`} aria-hidden={!open} inert={!open}>
        <div className="chapter-row__inner">
          <ChapterDetail chapter={ch} onOpenBlock={onOpenBlock} />
        </div>
      </div>
    </li>
  );
}

function ChapterDetail({ chapter: ch, onOpenBlock }: { chapter: Chapter; onOpenBlock: (b: Block) => void }) {
  const examples = blocksByChapter[ch.id] ?? [];
  return (
    <article className="chapter-detail">
      <div className="chapter-detail__main">
        <section className="chapter-detail__section">
          <h4 className="chapter-detail__heading">요약</h4>
          <Text typography="Body" color="secondary">{ch.summary}</Text>
        </section>

        <section className="chapter-detail__section">
          <h4 className="chapter-detail__heading">핵심 개념 <span className="chapter-detail__count">{ch.concepts.length}</span></h4>
          <dl className="concept-list">
            {ch.concepts.map((c) => (
              <div key={c.id} className="concept-list__row">
                <dt>
                  <span className="concept-list__ko">{c.ko}</span>
                  <span className="concept-list__en">{c.en}</span>
                  <span className="concept-list__page">p.{c.page}</span>
                </dt>
                <dd>{c.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="chapter-detail__section">
          <h4 className="chapter-detail__heading">헷갈리기 쉬운 점</h4>
          <ul className="pitfall-list">
            {ch.pitfalls.map((p) => (
              <li key={p.title}>
                <strong>{p.title}</strong>
                <span>{p.body}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="chapter-detail__section">
          <h4 className="chapter-detail__heading">이미지를 볼 때 던질 질문</h4>
          <ol className="question-list">
            {ch.questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>
        </section>
      </div>

      <aside className="chapter-detail__side">
        <dl className="chapter-detail__facts">
          <div>
            <dt>구분</dt>
            <dd>{partLabel[ch.part]} · {ch.no}장</dd>
          </div>
          <div>
            <dt>교재 쪽수</dt>
            <dd>{ch.pages[0]}–{ch.pages[1]}쪽 (9판)</dd>
          </div>
          {ch.weeks && (
            <div>
              <dt>관련 주차</dt>
              <dd>{ch.weeks.join(' · ')}</dd>
            </div>
          )}
        </dl>

        <section className="chapter-detail__examples">
          <h4 className="chapter-detail__heading">내 아카이브에서 <span className="chapter-detail__count">{examples.length}</span></h4>
          {examples.length === 0 ? (
            <p className="chapter-detail__empty">아직 이 장의 개념이 붙은 블록이 없습니다.</p>
          ) : (
            <ul className="thumb-grid">
              {examples.slice(0, 9).map((b) => (
                <li key={b.id}>
                  <button type="button" className="thumb" onClick={() => onOpenBlock(b)} title={`${b.no}. ${b.title}`}>
                    <img src={b.image.small} alt={`${b.no}. ${b.title}`} loading="lazy" />
                    <span className="thumb__no">{b.no}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {examples.length > 9 && <p className="chapter-detail__empty">외 {examples.length - 9}개 — 아카이브에서 개념으로 찾아볼 수 있습니다.</p>}
        </section>
      </aside>
    </article>
  );
}
