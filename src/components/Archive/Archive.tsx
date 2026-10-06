import { useEffect, useMemo, useRef, useState } from 'react';
import { Text } from '../Text/Text';
import { blocks, checkLabels, conceptIndex, koreanPart, termAnchor, weeks, type Block } from '../../data/study';
import { scrollToTarget } from '../../smoothScroll';
import './Archive.css';

/**
 * 내 아카이브 — Are.na 채널의 이미지 블록. 주차 · 점검 결과로 거르고, 누르면 상세(BlockDialog)가 열린다.
 * 필터 모양은 BI의 공통 세그먼트(styles/segmented.css).
 */
type WeekFilter = 'all' | (typeof weeks)[number]['id'];
type CheckFilter = 'all' | keyof typeof checkLabels;

export function Archive({ onOpen }: { onOpen: (b: Block) => void }) {
  const [week, setWeek] = useState<WeekFilter>('all');
  const [check, setCheck] = useState<CheckFilter>('all');
  const list = useMemo(
    () => blocks.filter((b) => (week === 'all' || b.week === week) && (check === 'all' || b.analysis?.check === check)),
    [week, check],
  );
  const theme = weeks.find((w) => w.id === week);

  return (
    <div className="archive">
      <div className="archive__filters">
        <div className="segmented" role="group" aria-label="주차">
          {[{ id: 'all' as const, label: '전체' }, ...weeks.map((w) => ({ id: w.id, label: `${w.id} ${w.theme}` }))].map((t) => (
            <button key={t.id} type="button" className="segmented__tab" aria-pressed={week === t.id} onClick={() => setWeek(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="segmented segmented--small" role="group" aria-label="점검 결과">
          {([['all', '모든 점검'], ...Object.entries(checkLabels).map(([k, v]) => [k, v.ko])] as [CheckFilter, string][]).map(([id, label]) => (
            <button key={id} type="button" className="segmented__tab" aria-pressed={check === id} onClick={() => setCheck(id)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="archive__summary">
        <Text as="p" typography="Label" color="tertiary">
          {list.length}개 블록{theme ? ` · ${theme.themeEn}` : ''}
        </Text>
        {theme && <Text typography="Body" color="secondary" className="archive__note">{theme.note}</Text>}
      </div>

      <ul className="archive-grid">
        {list.map((b) => (
          <li key={b.id}>
            <button type="button" className="archive-card" onClick={() => onOpen(b)}>
              <span className="archive-card__frame">
                <img src={b.image.small} alt="" loading="lazy" width={b.image.width} height={b.image.height} />
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

/**
 * 블록 상세 — <dialog>. 왼쪽 이미지, 오른쪽 기존 한국어 설명 · 영어 설명 · 라우어 개념 · 점검 메모.
 * 개념 캡슐을 누르면 창을 닫고 용어집의 그 항목으로 간다.
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
  const goTerm = (id: string) => {
    onClose();
    requestAnimationFrame(() => {
      const el = document.getElementById(termAnchor(id));
      if (!el) return;
      scrollToTarget(el);
      el.dataset.flash = 'true';
      setTimeout(() => delete el.dataset.flash, 1600);
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
              <h4 className="block-dialog__heading">기존 설명</h4>
              <Text typography="Body" color="secondary" className="block-dialog__ko">{koreanPart(block.description)}</Text>
            </section>

            {a && (
              <>
                <section className="block-dialog__section">
                  <h4 className="block-dialog__heading">
                    영어 설명
                    <span className="block-dialog__flag">{block.pushed ? 'Are.na 반영됨' : '제안 · 반영 전'}</span>
                  </h4>
                  <p className="block-dialog__en" lang="en">{a.en}</p>
                </section>

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
