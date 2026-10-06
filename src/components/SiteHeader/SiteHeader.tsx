import { useEffect, useState } from 'react';
import { scrollToTarget } from '../../smoothScroll';
import './SiteHeader.css';

/**
 * Top bar — BI(Phi Programs)의 상단바를 그대로 가져왔다: 왼쪽 워드마크, 오른쪽 캡슐 링크.
 * 상단바는 투명하고 페이지와 함께 스크롤되며, 워드마크(왼쪽 위)와 CTA(오른쪽 위)만 화면에 고정된다.
 * AL: 메뉴는 페이지 안 섹션으로, CTA는 Are.na 채널로.
 */
const links = [
  { id: 'structure', label: '구조' },
  { id: 'principles', label: '원리' },
  { id: 'elements', label: '요소' },
  { id: 'archive', label: '아카이브' },
  { id: 'glossary', label: '용어집' },
];

/** 맨 위로 버튼: 한 화면쯤 내려가면 오른쪽 아래에 나타나고, 누르면 부드럽게 맨 위로. */
export function BackToTop() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const update = () => setShown(window.scrollY > window.innerHeight * 0.8);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return (
    <button
      type="button"
      className="back-to-top"
      data-shown={shown}
      aria-label="맨 위로"
      title="맨 위로"
      tabIndex={shown ? 0 : -1}
      onClick={() => scrollToTarget(0)}
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
}

export function SiteHeader({ ctaHref }: { ctaHref: string }) {
  return (
    <header className="site-header">
      <a href="#" className="site-header__brand" aria-label="Aesthetic Literacy 처음으로" onClick={(e) => { e.preventDefault(); scrollToTarget(0); }}>AL</a>
      <nav className="site-header__nav" aria-label="주요 메뉴">
        {links.map((l) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            className="site-header__link"
            onClick={(e) => {
              const el = document.getElementById(l.id);
              if (!el) return;
              e.preventDefault();
              scrollToTarget(el);
            }}
          >
            {l.label}
          </a>
        ))}
      </nav>
      {/* Placeholder keeps the nav from sliding under the fixed CTA */}
      <span className="site-header__cta-space" aria-hidden="true" />
      <a href={ctaHref} className="site-header__cta" target="_blank" rel="noreferrer">
        Are.na 채널
      </a>
    </header>
  );
}
