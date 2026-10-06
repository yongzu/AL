import { useState } from 'react';
import { Text } from '../Text/Text';
import { chapters } from '../../data/study';

/**
 * 셀프 퀴즈 — 장마다 세 문제. BI 역량 · 태도 줄과 같은 모양: 질문 줄을 누르면 답이 펼쳐진다.
 * 원리(1–6장)는 왼쪽, 요소(7–13장)는 오른쪽 단.
 */
export function Quiz() {
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const [allOpen, setAllOpen] = useState(false);
  const toggle = (key: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const columns = [
    { label: '원리 · Principles', list: chapters.filter((c) => c.part !== 'element') },
    { label: '요소 · Elements', list: chapters.filter((c) => c.part === 'element') },
  ];

  return (
    <div className="quiz">
      <div className="quiz__tools">
        <button type="button" className="segmented__tab quiz__toggle" aria-pressed={allOpen} onClick={() => setAllOpen((v) => !v)}>
          {allOpen ? '답 모두 접기' : '답 모두 보기'}
        </button>
      </div>
      <div className="pillar-columns">
        {columns.map((col) => (
          <div key={col.label}>
            <div className="group-label">
              <Text as="h3" typography="Title">{col.label}</Text>
            </div>
            {col.list.map((ch) => (
              <div key={ch.id} className="quiz__chapter">
                <div className="rule-label">
                  <Text as="h4" typography="Label" color="secondary">{String(ch.no).padStart(2, '0')} {ch.ko}</Text>
                </div>
                <div className="pillar-list">
                  {ch.quiz.map((item, i) => {
                    const key = `${ch.id}-${i}`;
                    const isOpen = allOpen || open.has(key);
                    return (
                      <article key={key} className="pillar-row" data-open={isOpen}>
                        <button type="button" className="pillar-row__hit" aria-expanded={isOpen} aria-controls={`quiz-${key}`} onClick={() => toggle(key)}>
                          <span className="pillar-row__lead">
                            <Text as="span" typography="Label" color="tertiary">Q{i + 1}</Text>
                            <Text as="span" typography="Body" className="quiz__q">{item.q}</Text>
                          </span>
                        </button>
                        <div id={`quiz-${key}`} className="pillar-row__panel" role="region" aria-label={`${item.q} 답`}>
                          <div className="pillar-row__clip">
                            <div className="pillar-row__body">
                              <Text typography="Body" color="secondary">{item.a}</Text>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
