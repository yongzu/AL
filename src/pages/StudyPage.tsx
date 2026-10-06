import { useEffect, useState, type ReactNode } from 'react';
import { Text } from '../components/Text/Text';
import { Toc, type TocItem } from '../components/Toc/Toc';
import { BlurReveal } from '../components/BlurReveal/BlurReveal';
import { ApplyButton } from '../components/ApplyButton/ApplyButton';
import { BackToTop, SiteHeader } from '../components/SiteHeader/SiteHeader';
import { ChapterExplorer } from '../components/ChapterExplorer/ChapterExplorer';
import { Archive, BlockDialog } from '../components/Archive/Archive';
import { Glossary } from '../components/Glossary/Glossary';
import { Quiz } from '../components/Quiz/Quiz';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { scrollToTarget } from '../smoothScroll';
import {
  blocks,
  book,
  channel,
  chapters,
  conceptCount,
  conceptIndex,
  expressionList,
  expressionSuggestions,
  method,
  parts,
  sentencePattern,
  termAnchor,
  termMap,
  weeks,
  type Block,
} from '../data/study';
import './study.css';

const toc: TocItem[] = [
  { id: 'overview', label: '과목 개요' },
  { id: 'structure', label: '책의 구조' },
  { id: 'method', label: '분석하는 법' },
  { id: 'principles', label: '디자인 원리' },
  { id: 'elements', label: '디자인 요소' },
  { id: 'archive', label: '내 아카이브' },
  { id: 'glossary', label: '용어집' },
  { id: 'quiz', label: '셀프 퀴즈' },
];

const revealTargets = ['.section-header > *', '.group-label', '.group__lead', '.overview__inner', '.step-card', '.pattern'].join(', ');

const REPO = 'https://github.com/yongzu/AL';

/** Section title + lead — BI와 같이 제목 위, 리드 아래 */
function SectionHeader({ title, lead }: { title: ReactNode; lead?: ReactNode }) {
  return (
    <header className="section-header">
      <Text typography="Heading">{title}</Text>
      {lead && <Text typography="Lead" color="secondary">{lead}</Text>}
    </header>
  );
}

function GroupLabel({ children, meta }: { children: ReactNode; meta?: string }) {
  return (
    <div className="group-label">
      <Text as="h3" typography="Title">{children}</Text>
      {meta && <Text as="span" typography="Label" color="tertiary">{meta}</Text>}
    </div>
  );
}

/** 장으로 건너가기 — 장 목록에서 그 장을 펼치고 그 줄로 스크롤 */
function goChapter(id: string) {
  window.dispatchEvent(new CustomEvent('al:open-chapter', { detail: id }));
  requestAnimationFrame(() => {
    const el = document.getElementById(`chapter-${id}`);
    if (el) scrollToTarget(el);
  });
}

/* ------------------------------------------------------------------ */

function Hero() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(t);
  }, []);
  return (
    <section className="hero container" aria-label="Aesthetic Literacy" data-ready={ready}>
      <BlurReveal lines={['Aesthetic', 'Literacy']} typography="Display" headingClassName="hero__title" show={ready} />
      <BlurReveal
        lines={['보는 것을 말로 옮기는 힘,', '조형의 언어로 이미지를 읽습니다.']}
        typography="Subheading"
        headingClassName="hero__statement"
        className="hero__intro"
        delay={350}
        show={ready}
      >
        <Text typography="Intro" color="secondary">
          데이비드 라우어 · 스티븐 펜탁 『{book.title}』 {book.edition}으로 정리한 학습 노트와 이미지 아카이브
        </Text>
      </BlurReveal>
      <div className="hero__cta hero__fade">
        <Text typography="Label" className="hero__meta">
          {chapters.length} Chapters · {conceptCount} Concepts · {blocks.length} Images
        </Text>
        <ApplyButton href="#structure">학습 시작하기</ApplyButton>
      </div>
    </section>
  );
}

function Overview() {
  const facts = [
    { label: '교재', value: `${book.title} ${book.edition} (${book.year})` },
    { label: '저자', value: book.authors },
    { label: '구성', value: '원리 6장 · 요소 7장' },
    { label: '아카이브', value: `${channel.title} · ${blocks.length}개 이미지` },
    { label: '진행', value: `${weeks.map((w) => w.id).join(' · ')}` },
  ];
  return (
    <section id="overview" className="overview container" aria-label="과목 개요">
      <div className="overview__inner">
        <div className="overview__text">
          <Text as="p" typography="Label" className="overview__head">Aesthetic Literacy</Text>
          <Text typography="Body" color="secondary" className="overview__para">
            Aesthetic Literacy는 이미지를 ‘좋다 · 멋지다’에서 멈추지 않고, 무엇이 그 인상을 만드는지 조형의 언어로 설명하는 연습이다. 기준은 라우어의 『{book.title}』 — 선 · 형태 · 명도 같은 요소가 통일 · 강조 · 리듬 같은 원리로 조직되는 방식을 다룬다.
          </Text>
          <Text typography="Body" color="secondary" className="overview__para">
            이 페이지는 책의 핵심을 장별로 요약하고, Are.na에 모은 이미지마다 책의 개념을 붙여 두었다. 개념에서 이미지로, 이미지에서 개념으로 오가며 공부할 수 있다.
          </Text>
        </div>
        <div className="overview__facts">
          <Text as="p" typography="Label" className="overview__head">과목 개요</Text>
          <dl>
            {facts.map((f) => (
              <div key={f.label} className="overview__row">
                <Text as="dt" typography="Label" color="tertiary">{f.label}</Text>
                <Text as="dd" typography="Body">{f.value}</Text>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/** 책의 구조 — 원리 | 요소 두 단. 줄을 누르면 아래 장 목록의 그 장으로 건너간다 */
function Structure() {
  const columns = parts.map((p) => ({ ...p, list: chapters.filter((c) => (p.id === 'principle' ? c.part !== 'element' : c.part === 'element')) }));
  return (
    <div className="pillar-columns">
      {columns.map((col) => (
        <div key={col.id}>
          <GroupLabel meta={col.en}>{col.ko}</GroupLabel>
          <Text typography="Body" color="secondary" className="group__lead">{col.body}</Text>
          <div className="pillar-list">
            {col.list.map((ch) => (
              <article key={ch.id} className="pillar-row">
                <button type="button" className="pillar-row__hit" onClick={() => goChapter(ch.id)}>
                  <span className="pillar-row__lead">
                    <Text as="span" typography="Label" color="tertiary">{String(ch.no).padStart(2, '0')}</Text>
                    <span className="pillar-row__titles">
                      <Text as="span" typography="Title">{ch.ko}</Text>
                      <Text as="span" typography="Label" color="tertiary">{ch.en}</Text>
                    </span>
                  </span>
                </button>
              </article>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** 수업 주차 — Expression List(텍스트 블록)의 표현과 책의 장 연결 */
function Weeks() {
  const listed = parseExpressionList(expressionList?.content ?? '');
  return (
    <div className="weeks">
      {weeks.map((w) => {
        const words = listed[w.id] ?? [];
        const empty = words.length === 0 || words.every((x) => /^\d+$/.test(x));
        const suggested = (expressionSuggestions as Record<string, string[]>)[w.id];
        return (
          <article key={w.id} className="week">
            <div className="week__head">
              <Text as="span" typography="Label" color="tertiary">{w.id}</Text>
              <Text as="h4" typography="Title">{w.theme}</Text>
              <Text as="span" typography="Label" color="tertiary">{w.themeEn}</Text>
            </div>
            <Text typography="Body" color="secondary" className="week__note">{w.note}</Text>
            <div className="week__rows">
              <div>
                <span className="week__key">관련 장</span>
                <div className="chips">
                  {w.chapters.map((id) => {
                    const ch = chapters.find((c) => c.id === id)!;
                    return (
                      <a key={id} href={`#chapter-${id}`} className="chip" onClick={(e) => { e.preventDefault(); goChapter(id); }}>
                        {ch.no}장 {ch.ko}
                      </a>
                    );
                  })}
                </div>
              </div>
              <div>
                <span className="week__key">수업 표현</span>
                {empty ? (
                  <span className="week__empty">
                    비어 있음{suggested && <> — 후보: {suggested.join(' · ')}</>}
                  </span>
                ) : (
                  <span className="week__words">{words.join(' · ')}</span>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/** "WK02 동세감\n- 흐린 윤곽 34·35\n..." → { WK02: ['흐린 윤곽 34·35', ...] } (옛 "1. …" 형식도 읽는다) */
function parseExpressionList(text: string) {
  const out: Record<string, string[]> = {};
  let current = '';
  for (const line of text.split('\n').map((l) => l.trim())) {
    const wk = line.match(/^(WK\d+)/);
    if (wk) {
      current = wk[1];
      out[current] = [];
    } else if (current && /^(\d+\.|-)\s*/.test(line)) out[current].push(line.replace(/^(\d+\.|-)\s*/, ''));
  }
  return out;
}

function Method() {
  return (
    <>
      <div className="group">
        <div className="rule-label">
          <Text as="h3" typography="Label" color="secondary">기술 → 요소 → 원리 → 해석</Text>
        </div>
        <div className="grid-steps">
          {method.map((m, i) => (
            <article key={m.step} className="step-card">
              <Text as="span" typography="Label" color="inherit" className="step-card__badge">{String(i + 1).padStart(2, '0')}</Text>
              <Text as="h4" typography="Title" className="step-card__name">{m.step}</Text>
              <Text as="span" typography="Label" color="tertiary">{m.en}</Text>
              <Text typography="Body" color="secondary">{m.body}</Text>
              <p className="step-card__example">예) {m.prompt}</p>
            </article>
          ))}
        </div>
        <div className="pattern">
          <Text as="p" typography="Label" color="tertiary">한 문장 틀</Text>
          <p className="pattern__sentence">{sentencePattern}</p>
          <Text typography="Body" color="secondary">예) 극단적인 흑백 대비(명도)가 고립에 의한 강조를 통해 작은 실루엣을 화면의 초점으로 만든다.</Text>
        </div>
      </div>

      <div className="group">
        <GroupLabel meta="수업 표현 → 책의 용어">용어 바로잡기</GroupLabel>
        <Text typography="Body" color="secondary" className="group__lead">블록과 수업에서 쓴 표현 중 책의 용어와 다르거나 더 정확한 이름이 있는 것들. 블록 점검(5번 작업)의 기준이다.</Text>
        <table className="term-table">
          <thead>
            <tr>
              <th scope="col">쓴 표현</th>
              <th scope="col">책의 용어</th>
              <th scope="col">설명</th>
            </tr>
          </thead>
          <tbody>
            {termMap.map((t) => {
              const c = conceptIndex[t.concept];
              return (
                <tr key={t.said}>
                  <td>{t.said}</td>
                  <td>
                    <a className="link" href={`#${termAnchor(t.concept)}`}>{t.book}</a>
                  </td>
                  <td>
                    {t.note} <span className="term-table__page">({c.chapter.no}장 {c.page}쪽)</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

export function StudyPage() {
  useScrollReveal(revealTargets);
  const [openBlock, setOpenBlock] = useState<Block | null>(null);

  return (
    <>
      <SiteHeader ctaHref={channel.url} />
      <BackToTop />
      <main className="page">
        <Hero />

        <div className="page-shell">
          <div className="toc-rail">
            <Toc items={toc} title="Aesthetic Literacy" />
          </div>

          <Overview />

          <section id="structure" className="section container">
            <SectionHeader
              title="책의 구조"
              lead="『Design Basics』는 두 부분이다. 원리는 요소를 ‘어떻게’ 조직하는지, 요소는 ‘무엇으로’ 조직하는지를 다룬다. 장을 누르면 아래 요약으로 건너간다."
            />
            <div className="group">
              <Structure />
            </div>
            <div className="group">
              <GroupLabel meta="Weekly Themes">수업 주차</GroupLabel>
              <Text typography="Body" color="secondary" className="group__lead">Are.na의 Expression List에 적은 주차별 표현과 책의 장을 이었다.</Text>
              <Weeks />
            </div>
          </section>

          <section id="method" className="section container">
            <SectionHeader
              title="분석하는 법"
              lead="라우어의 비평 모델(1장, 24쪽)은 기술 → 분석 → 해석이다. 분석 단계를 ‘요소’와 ‘원리’로 나누면 이미지를 말로 옮기는 순서가 된다."
            />
            <Method />
          </section>

          <section id="principles" className="section container">
            <SectionHeader title="디자인 원리" lead="1–6장. 디자인 과정과 다섯 가지 원리 — 통일, 강조와 초점, 스케일과 비례, 균형, 리듬." />
            <div className="group">
              <ChapterExplorer chapters={chapters.filter((c) => c.part !== 'element')} onOpenBlock={setOpenBlock} />
            </div>
          </section>

          <section id="elements" className="section container">
            <SectionHeader title="디자인 요소" lead="7–13장. 화면을 이루는 일곱 가지 재료 — 선, 형태, 패턴과 질감, 공간, 동세, 명도, 색." />
            <div className="group">
              <ChapterExplorer chapters={chapters.filter((c) => c.part === 'element')} onOpenBlock={setOpenBlock} />
            </div>
          </section>

          <section id="archive" className="section container">
            <SectionHeader
              title="내 아카이브"
              lead={<>Are.na 채널의 이미지마다 책의 개념을 붙이고 기존 설명을 책과 대조했다. 이미지를 누르면 영어 설명 · 개념 · 점검 메모가 열린다.</>}
            />
            <div className="group">
              <Archive onOpen={setOpenBlock} />
            </div>
          </section>

          <section id="glossary" className="section container">
            <SectionHeader title="용어집" lead={`${conceptCount}개 개념의 한영 대조. 작은 썸네일은 그 개념이 붙은 내 블록이다.`} />
            <div className="group">
              <Glossary onOpenBlock={setOpenBlock} />
            </div>
          </section>

          <section id="quiz" className="section section--last container">
            <SectionHeader title="셀프 퀴즈" lead="장마다 세 문제. 답을 떠올린 뒤 줄을 눌러 확인한다." />
            <div className="group">
              <Quiz />
            </div>
          </section>
        </div>
      </main>

      <footer className="footer container">
        <Text typography="Title">Aesthetic Literacy</Text>
        <Text typography="Body" color="secondary">
          『{book.title}』 {book.edition}({book.authors}, {book.publisher}, {book.year})의 내용을 학습용으로 직접 요약했습니다. 책의 원문과 도판은 싣지 않으며, 쪽수로 출처를 표시합니다.
        </Text>
        <Text typography="Label" color="tertiary">
          <a className="link" href={channel.url} target="_blank" rel="noreferrer">Are.na 채널</a> · <a className="link" href={REPO} target="_blank" rel="noreferrer">GitHub</a> · 아카이브 갱신 {channel.pulled}
        </Text>
      </footer>

      <BlockDialog block={openBlock} onClose={() => setOpenBlock(null)} />
    </>
  );
}
