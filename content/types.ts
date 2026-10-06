/**
 * 학습 자료의 단일 원본(single source) 타입.
 * 사이트(src/)와 Are.na 스크립트(scripts/)가 같은 content/ 파일을 읽는다.
 *
 * 저작권: 책 원문을 옮기지 않는다. 모든 설명은 직접 정리한 요약이고, 쪽수(page)로 책을 가리킨다.
 */

/** 책의 세 부분 — 1장(디자인 과정)은 Part 1에 들어 있지만 원리가 아니라 방법을 다룬다 */
export type Part = 'process' | 'principle' | 'element';

/** 장 안의 개념 하나 = 용어집 항목 하나 = 블록 태그 하나 */
export type Concept = {
  /** `장id.개념` 꼴 — 예: unity.proximity. 블록 태그와 커넥션 채널 이름에 쓴다 */
  id: string;
  ko: string;
  en: string;
  /** 책 9판 쪽수 */
  page: number;
  /** 한두 문장 정의(직접 정리) */
  body: string;
};

export type Chapter = {
  id: string;
  no: number;
  part: Part;
  ko: string;
  en: string;
  pages: [number, number];
  /** 한 줄 정의 */
  oneLine: string;
  /** 장 요약(2–3문장) */
  summary: string;
  concepts: Concept[];
  /** 헷갈리기 쉬운 점 · 블록에 쓸 때 주의 */
  pitfalls: { title: string; body: string }[];
  /** 이미지를 볼 때 던질 질문 */
  questions: string[];
  /** 셀프 퀴즈 */
  quiz: { q: string; a: string }[];
  /** 수업 주차와의 연결 */
  weeks?: string[];
};

/** 블록 한 개의 분석 — review/를 거쳐 승인된 것만 Are.na에 반영한다 */
export type BlockAnalysis = {
  /** 영어 설명(2–3문장) */
  en: string;
  /** 라우어 개념 태그 — Concept.id */
  concepts: string[];
  /** 기존 한국어 글의 점검 */
  check: 'ok' | 'revise' | 'expand';
  /** 점검 메모(무엇이 책과 다른지, 무엇을 더하면 좋은지) */
  notes: string[];
};
