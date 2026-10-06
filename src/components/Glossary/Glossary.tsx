import { useDeferredValue, useMemo, useState } from 'react';
import { Text } from '../Text/Text';
import { blocksByConcept, chapters, termAnchor, type Block } from '../../data/study';
import './Glossary.css';

/**
 * 용어집 — 모든 장의 핵심 개념(= 블록 태그). 한글 · 영문 · 정의로 찾고, 원리 · 요소로 거른다.
 * 각 용어에는 그 개념이 붙은 내 블록의 작은 썸네일이 붙는다.
 */
type PartFilter = 'all' | 'principle' | 'element';

export function Glossary({ onOpenBlock }: { onOpenBlock: (b: Block) => void }) {
  const [query, setQuery] = useState('');
  const [part, setPart] = useState<PartFilter>('all');
  const q = useDeferredValue(query.trim().toLowerCase());

  const groups = useMemo(
    () =>
      chapters
        .filter((ch) => part === 'all' || (part === 'principle' ? ch.part !== 'element' : ch.part === 'element'))
        .map((ch) => ({
          chapter: ch,
          terms: ch.concepts.filter((c) => !q || `${c.ko} ${c.en} ${c.body}`.toLowerCase().includes(q)),
        }))
        .filter((g) => g.terms.length > 0),
    [q, part],
  );
  const total = groups.reduce((n, g) => n + g.terms.length, 0);

  return (
    <div className="glossary">
      <div className="glossary__tools">
        <label className="glossary__search">
          <span className="visually-hidden">용어 찾기</span>
          <input type="search" placeholder="용어 찾기 — 예: 리듬, rhythm, 대비" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <div className="segmented segmented--small" role="group" aria-label="구분">
          {([['all', '전체'], ['principle', '원리'], ['element', '요소']] as [PartFilter, string][]).map(([id, label]) => (
            <button key={id} type="button" className="segmented__tab" aria-pressed={part === id} onClick={() => setPart(id)}>
              {label}
            </button>
          ))}
        </div>
        <Text as="span" typography="Label" color="tertiary">{total}개</Text>
      </div>

      {groups.length === 0 && <Text typography="Body" color="tertiary" className="glossary__empty">찾는 용어가 없습니다.</Text>}

      {groups.map(({ chapter: ch, terms }) => (
        <section key={ch.id} className="glossary__group" aria-label={ch.ko}>
          <div className="rule-label">
            <Text as="h3" typography="Label" color="secondary">{String(ch.no).padStart(2, '0')} {ch.ko} · {ch.en}</Text>
          </div>
          <dl className="glossary__list">
            {terms.map((c) => {
              const examples = blocksByConcept[c.id] ?? [];
              return (
                <div key={c.id} id={termAnchor(c.id)} className="glossary__item">
                  <dt>
                    <span className="glossary__ko">{c.ko}</span>
                    <span className="glossary__en">{c.en}</span>
                  </dt>
                  <dd>
                    <p className="glossary__body">{c.body}</p>
                    <div className="glossary__foot">
                      <span className="glossary__page">p.{c.page}</span>
                      {examples.length > 0 && (
                        <span className="glossary__examples">
                          {examples.slice(0, 6).map((b) => (
                            <button key={b.id} type="button" className="glossary__thumb" onClick={() => onOpenBlock(b)} title={`${b.no}. ${b.title}`}>
                              <img src={b.image.small} alt={`${b.no}. ${b.title}`} loading="lazy" />
                            </button>
                          ))}
                          {examples.length > 6 && <span className="glossary__more">+{examples.length - 6}</span>}
                        </span>
                      )}
                    </div>
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>
      ))}
    </div>
  );
}
