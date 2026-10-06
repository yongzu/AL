import { useEffect, useMemo, useRef, useState } from 'react';
import { Text } from '../Text/Text';
import {
  blocks,
  checkLabels,
  collectionUrl,
  collections,
  collectionsByBlock,
  conceptIndex,
  koreanPart,
  termAnchor,
  weeks,
  type Block,
} from '../../data/study';
import { average, canEditScores, setScore, useScores } from '../../data/scores';
import { scrollToTarget } from '../../smoothScroll';
import './Archive.css';

/**
 * 내 아카이브 — Are.na 채널의 이미지 블록. 주차 · 컬렉션 · 점검 결과로 거르고 번호순 · 점수순으로 늘어놓는다.
 * 누르면 상세(BlockDialog)가 열린다. 필터 모양은 BI의 공통 세그먼트(styles/segmented.css).
 */
type WeekFilter = 'all' | (typeof weeks)[number]['id'];
type CheckFilter = 'all' | keyof typeof checkLabels;
type Sort = 'no' | 'score';

export function Archive({ onOpen }: { onOpen: (b: Block) => void }) {
  const [week, setWeek] = useState<WeekFilter>('all');
  const [collection, setCollection] = useState<string>('all');
  const [check, setCheck] = useState<CheckFilter>('all');
  const [sort, setSort] = useState<Sort>('no');
  const scores = useScores();

  const list = useMemo(() => {
    const members = collection === 'all' ? null : new Set(collections.find((c) => c.id === collection)?.blocks);
    const out = blocks.filter(
      (b) => (week === 'all' || b.week === week) && (check === 'all' || b.analysis?.check === check) && (!members || members.has(b.no)),
    );
    if (sort === 'score') out.sort((a, z) => (scores[z.no] ?? 0) - (scores[a.no] ?? 0) || a.no - z.no);
    return out;
  }, [week, collection, check, sort, scores]);

  const theme = weeks.find((w) => w.id === week);
  const picked = collections.find((c) => c.id === collection);
  const scored = list.map((b) => scores[b.no]).filter((s): s is number => s != null);
  const avg = average(scored);

  return (
    <div className="archive">
      <div className="archive__filters">
        <div className="archive__filter-row">
          <span className="archive__filter-key">주차</span>
          <div className="segmented" role="group" aria-label="주차">
            {[{ id: 'all' as const, label: '전체' }, ...weeks.map((w) => ({ id: w.id, label: `${w.id} ${w.theme}` }))].map((t) => (
              <button key={t.id} type="button" className="segmented__tab" aria-pressed={week === t.id} onClick={() => setWeek(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="archive__filter-row">
          <span className="archive__filter-key">컬렉션</span>
          <div className="segmented segmented--small" role="group" aria-label="컬렉션">
            {[{ id: 'all', label: '전체' }, ...collections.map((c) => ({ id: c.id, label: `${c.ko} ${c.blocks.length}` }))].map((t) => (
              <button key={t.id} type="button" className="segmented__tab" aria-pressed={collection === t.id} onClick={() => setCollection(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="archive__filter-row">
          <span className="archive__filter-key">보기</span>
          <div className="segmented segmented--small" role="group" aria-label="점검 결과">
            {([['all', '모든 점검'], ...Object.entries(checkLabels).map(([k, v]) => [k, v.ko])] as [CheckFilter, string][]).map(([id, label]) => (
              <button key={id} type="button" className="segmented__tab" aria-pressed={check === id} onClick={() => setCheck(id)}>
                {label}
              </button>
            ))}
          </div>
          <div className="segmented segmented--small" role="group" aria-label="정렬">
            {([['no', '번호순'], ['score', '점수순']] as [Sort, string][]).map(([id, label]) => (
              <button key={id} type="button" className="segmented__tab" aria-pressed={sort === id} onClick={() => setSort(id)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="archive__summary">
        <Text as="p" typography="Label" color="tertiary">
          {list.length}개 블록
          {avg != null ? ` · 평균 ${avg}점(${scored.length}개 채점)` : ' · 아직 채점한 블록 없음'}
          {theme ? ` · ${theme.themeEn}` : ''}
        </Text>
        {theme && <Text typography="Body" color="secondary" className="archive__note">{theme.note}</Text>}
        {picked && (
          <Text typography="Body" color="secondary" className="archive__note">
            {picked.body}{' '}
            {collectionUrl(picked.id) && (
              <a className="link" href={collectionUrl(picked.id)} target="_blank" rel="noreferrer">Are.na 컬렉션</a>
            )}
          </Text>
        )}
        {canEditScores && <Text as="p" typography="Label" className="archive__edit">채점 모드 — 이미지를 열어 1–10점을 누르면 content/scores.json에 저장됩니다.</Text>}
      </div>

      <ul className="archive-grid">
        {list.map((b) => (
          <li key={b.id}>
            <button type="button" className="archive-card" onClick={() => onOpen(b)}>
              <span className="archive-card__frame">
                <img src={b.image.small} alt="" loading="lazy" width={b.image.width} height={b.image.height} />
                {scores[b.no] != null && <span className="archive-card__score">{scores[b.no]}</span>}
              </span>
              <span className="archive-card__meta">
                <span className="archive-card__no">{String(b.no).padStart(2, '0')}</span>
                <span className="archive-card__title">{b.title}</span>
              </span>
              <span className="archive-card__sub">
                <span>{b.week}</span>
                {b.analysis && <span className="status" data-check={b.analysis.check}>{checkLabels[b.analysis.check].ko}</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 1–10점 — 개발 서버에서는 버튼, 배포본에서는 읽기 전용 */
function ScoreField({ no }: { no: number }) {
  const score = useScores()[no];
  if (!canEditScores) {
    return score != null ? (
      <p className="score-view"><strong>{score}</strong> / 10</p>
    ) : (
      <p className="score-view score-view--empty">아직 채점하지 않았습니다.</p>
    );
  }
  return (
    <div className="score-edit" role="group" aria-label="점수">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button key={n} type="button" className="score-edit__btn" aria-pressed={score === n} onClick={() => setScore(no, n)}>
          {n}
        </button>
      ))}
      <button type="button" className="score-edit__clear" disabled={score == null} onClick={() => setScore(no, null)}>지우기</button>
    </div>
  );
}

/**
 * 블록 상세 — <dialog>. 왼쪽 이미지, 오른쪽 점수 · 기존 한국어 설명 · 영어 설명 · 라우어 개념 · 컬렉션 · 점검 메모.
 * 개념 캡슐을 누르면 창을 닫고 용어집의 그 항목으로 간다. 컬렉션 캡슐은 Are.na 채널로.
 */
export function BlockDialog({ block, onClose }: { block: Block | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (block && !d.open) d.showModal();
    if (!block && d.open) d.close();
  }, [block]);

  const a = block?.analysis;
  const inCollections = block ? collectionsByBlock[block.no] ?? [] : [];
  const goTerm = (id: string) => {
    onClose();
    requestAnimationFrame(() => {
      const el = document.getElementById(termAnchor(id));
      if (!el) return;
      scrollToTarget(el);
      el.dataset.flash = 'true';
      setTimeout(() => delete el.dataset.flash, 2400);
    });
  };

  return (
    <dialog
      ref={ref}
      className="block-dialog"
      aria-label={block ? `${block.no}. ${block.title}` : undefined}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-lenis-prevent
    >
      {block && (
        <div className="block-dialog__inner">
          <figure className="block-dialog__figure">
            <img src={block.image.medium} alt={a?.en ?? block.title} width={block.image.width} height={block.image.height} />
          </figure>

          <div className="block-dialog__body">
            <header className="block-dialog__head">
              <Text as="p" typography="Label" color="tertiary">{block.week} · {String(block.no).padStart(2, '0')}</Text>
              <Text as="h3" typography="Subheading">{block.title}</Text>
              <div className="block-dialog__links">
                {a && <span className="status" data-check={a.check}>{checkLabels[a.check].ko}</span>}
                <a className="link" href={block.url} target="_blank" rel="noreferrer">Are.na에서 보기</a>
              </div>
            </header>

            <section className="block-dialog__section">
              <h4 className="block-dialog__heading">내 점수</h4>
              <ScoreField no={block.no} />
            </section>

            <section className="block-dialog__section">
              <h4 className="block-dialog__heading">기존 설명</h4>
              <Text typography="Body" color="secondary" className="block-dialog__ko">{koreanPart(block.description)}</Text>
            </section>

            {a && (
              <section className="block-dialog__section">
                <h4 className="block-dialog__heading">
                  영어 설명
                  <span className="block-dialog__flag">{block.pushed ? 'Are.na 반영됨' : '제안 · 반영 전'}</span>
                </h4>
                <p className="block-dialog__en" lang="en">{a.en}</p>
              </section>
            )}

            {inCollections.length > 0 && (
              <section className="block-dialog__section">
                <h4 className="block-dialog__heading">컬렉션</h4>
                <div className="chips">
                  {inCollections.map((c) => (
                    <a key={c.id} href={collectionUrl(c.id)} className="chip" target="_blank" rel="noreferrer">
                      {c.ko}
                      <span className="chip__en">{c.blocks.length}</span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {a && (
              <>
                <section className="block-dialog__section">
                  <h4 className="block-dialog__heading">라우어 개념</h4>
                  <div className="chips">
                    {a.concepts.map((id) => {
                      const c = conceptIndex[id];
                      return (
                        <a
                          key={id}
                          href={`#${termAnchor(id)}`}
                          className="chip"
                          onClick={(e) => {
                            e.preventDefault();
                            goTerm(id);
                          }}
                        >
                          {c.ko}
                          <span className="chip__en">{c.en} · p.{c.page}</span>
                        </a>
                      );
                    })}
                  </div>
                </section>

                <section className="block-dialog__section">
                  <h4 className="block-dialog__heading">책 기준 점검</h4>
                  <ul className="block-dialog__notes">
                    {a.notes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </section>
              </>
            )}
          </div>

          <button type="button" className="block-dialog__close" aria-label="닫기" onClick={onClose}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
      )}
    </dialog>
  );
}
