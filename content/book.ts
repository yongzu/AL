import type { Chapter, Concept } from './types.ts';
import { principleChapters } from './chapters-principles.ts';
import { elementChapters } from './chapters-elements.ts';

export const book = {
  title: 'Design Basics',
  edition: '9판',
  year: 2016,
  authors: 'Stephen Pentak · David A. Lauer',
  publisher: 'Cengage Learning',
};

export const chapters: Chapter[] = [...principleChapters, ...elementChapters];

/** 개념 id → 개념 + 소속 장 */
export const conceptIndex: Record<string, Concept & { chapter: Chapter }> = Object.fromEntries(
  chapters.flatMap((ch) => ch.concepts.map((c) => [c.id, { ...c, chapter: ch }])),
);

export const parts = [
  {
    id: 'principle',
    ko: '디자인 원리',
    en: 'Design Principles',
    body: '요소를 어떻게 조직하는가. 통일 · 강조 · 스케일과 비례 · 균형 · 리듬은 화면 전체의 질서를 만드는 방법이다.',
  },
  {
    id: 'element',
    ko: '디자인 요소',
    en: 'Design Elements',
    body: '무엇으로 조직하는가. 선 · 형태 · 패턴과 질감 · 공간 · 동세 · 명도 · 색은 화면을 이루는 재료다.',
  },
] as const;

/**
 * 이미지를 말로 옮기는 순서 — 1장의 비평 모델(기술 → 분석 → 해석)에 요소 · 원리를 끼워 넣은 것.
 */
export const method = [
  { step: '기술', en: 'Description', body: '보이는 것을 판단 없이 적는다. 무엇이, 어디에, 얼마나 크게, 어떤 색과 명도로 있는가.', prompt: '화면 왼쪽 아래에 검은 실루엣의 인물이 걷고 있고, 나머지는 밝은 벽이다.' },
  { step: '요소', en: 'Elements', body: '선 · 형태 · 질감 · 공간 · 동세 · 명도 · 색 중 이 이미지를 이끄는 요소를 한두 개 고른다.', prompt: '지배적인 요소는 명도(극단적 흑백 대비)와 형태(세부가 지워진 실루엣)다.' },
  { step: '원리', en: 'Principles', body: '그 요소들이 어떤 관계로 조직되는지 원리의 이름으로 말한다 — 통일, 강조, 스케일, 균형, 리듬.', prompt: '작은 검은 형태가 넓은 흰 면과 비대칭 균형을 이루며, 고립과 명도 대비로 초점이 된다.' },
  { step: '해석', en: 'Interpretation', body: '그래서 어떤 효과와 의미가 생기는지 쓴다. 앞 단계의 근거가 있어야 해석이 설득력을 갖는다.', prompt: '인물의 개성 대신 공간을 가로지르는 움직임 자체가 주인공이 된다.' },
] as const;

/** 한 문장 틀 */
export const sentencePattern = '[요소]가 [원리]를 통해 [효과]를 만든다.';

/**
 * 수업에서 쓴 표현 → 책의 용어. 블록 점검(5번 작업)의 기준표.
 */
export const termMap: { said: string; book: string; concept: string; note: string }[] = [
  { said: '강제 원근법', book: '증폭된 원근', concept: 'space.amplified', note: '대상이 관람자를 정면으로 향할 때의 극적인 단축. 강제 원근법은 사진 · 영화의 착시 기법 이름이다.' },
  { said: '시각적 잔상', book: '흐린 윤곽 · 다중 이미지', concept: 'motion.blurred', note: '움직임의 흔적이 남는 표현. 책의 ‘잔상(afterimage)’은 망막 피로로 생기는 광학적 움직임이다.' },
  { said: '근육운동감각', book: '운동감각적 공감', concept: 'motion.kinesthetic', note: '보는 동작이나 저항을 몸이 따라 느끼는 현상(리듬 112쪽, 동세 232쪽).' },
  { said: '중력', book: '예상되는 움직임 · 수직 배치', concept: 'motion.anticipated', note: '중력을 거스르는 자세는 곧 일어날 동작을 예상하게 한다. 위가 무거운 화면은 균형의 수직 배치로 설명한다.' },
  { said: '제스처', book: '제스처 드로잉', concept: 'line.gesture', note: '형태보다 동작 · 무게 · 자세를 잡는 빠른 선.' },
  { said: '게슈탈트', book: '게슈탈트(시각적 지각)', concept: 'unity.gestalt', note: '근접 · 유사한 모양끼리 묶고, 틈을 이어 전체를 보는 지각 경향.' },
  { said: '변주', book: '변화된 반복 · 변화를 동반한 통일', concept: 'unity.varied-repetition', note: '같은 주제를 조금씩 바꿔 되풀이하는 것.' },
  { said: '응집력', book: '근접 · 반복에 의한 통일', concept: 'unity.proximity', note: '무엇이 요소들을 묶는지(가까움, 같은 모양) 함께 쓴다.' },
  { said: '파편화', book: '변화 강조 · 혼돈과 통제', concept: 'unity.emphasis-variety', note: '흩어진 요소를 붙잡는 통일 요소가 무엇인지까지 쓴다.' },
  { said: '유기적', book: '곡선형 · 생물형태', concept: 'shape.biomorphic', note: '자연의 유기적 형태를 암시하는 추상 형태.' },
  { said: '레가토 리듬', book: '레가토', concept: 'rhythm.legato', note: '이어지고 흐르는 리듬. 구조(교차 · 점진)와 함께 쓰면 더 정확하다.' },
  { said: '스타카토 리듬', book: '스타카토', concept: 'rhythm.staccato', note: '끊어지고 튀는 리듬.' },
  { said: '색수차', book: '진동하는 색 · 시각적 질감', concept: 'color.discord', note: '렌즈 용어. 색이 갈라져 경계가 떨리는 효과로 옮겨 쓴다.' },
];

/** 수업 주차 — 주제는 Are.na의 Expression List(텍스트 블록)에서 */
export const weeks = [
  { id: 'WK01', theme: '자유 수집', themeEn: 'Open Collection', chapters: ['shape', 'value', 'texture', 'space'], note: 'Expression List에 주제가 적혀 있지 않은 첫 주. 실루엣 · 명암 · 투과 · 기계와 신체 이미지를 모았다.' },
  { id: 'WK02', theme: '동세감', themeEn: 'Illusion of Motion', chapters: ['motion', 'line', 'space'], note: '책 11장 동세의 환영. 선(제스처)과 증폭된 원근이 함께 쓰였다.' },
  { id: 'WK03', theme: '통일감', themeEn: 'Unity', chapters: ['unity', 'balance'], note: '책 2장 통일. 대칭 · 방사 구조는 5장 균형과도 이어진다.' },
  { id: 'WK04', theme: '리듬', themeEn: 'Rhythm', chapters: ['rhythm', 'texture'], note: '책 6장 리듬. 레가토 · 스타카토와 교차 · 점진적 리듬.' },
] as const;
