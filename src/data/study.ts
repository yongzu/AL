/**
 * 사이트가 쓰는 데이터 — content/의 책 정리 + Are.na 아카이브(content/archive.json) + 블록 분석을 한데 묶는다.
 */
import archiveJson from '../../content/archive.json';
import { analysis, expressionSuggestions } from '../../content/analysis.ts';
import { book, chapters, conceptIndex, method, parts, sentencePattern, termMap, weeks } from '../../content/book.ts';
import { collections, collectionTitle, type Collection } from '../../content/collections.ts';
import collectionChannels from '../../content/collections-arena.json';
import type { BlockAnalysis, Chapter } from '../../content/types.ts';

export { book, chapters, conceptIndex, method, parts, sentencePattern, termMap, weeks, expressionSuggestions, collections, collectionTitle };
export type { Chapter, Collection };

/** 컬렉션 id → Are.na 채널 주소 */
export const collectionUrl = (id: string) => (collectionChannels as Record<string, { url: string }>)[id]?.url;

/** 블록 번호 → 그 블록이 속한 컬렉션들 */
export const collectionsByBlock: Record<number, Collection[]> = {};
for (const c of collections) for (const no of c.blocks) (collectionsByBlock[no] ??= []).push(c);

type RawBlock = (typeof archiveJson.blocks)[number];

export type Block = {
  id: number;
  no: number;
  title: string;
  week: string;
  description: string;
  image: { width: number; height: number; small: string; medium: string; large: string };
  url: string;
  analysis?: BlockAnalysis;
  /** 영어 설명이 이미 Are.na에 반영되었는가(scripts/arena-push.mjs가 남기는 표시) */
  pushed: boolean;
};

export const channel = archiveJson.channel;

/** 반영 표시 — 한국어 설명 아래 `---` 다음 줄이 `**EN**`로 시작한다 */
export const EN_MARKER = '**EN**';

/** 반영된 설명에서 한국어 원문만 */
export function koreanPart(description: string) {
  const i = description.indexOf(`\n---\n${EN_MARKER}`);
  return (i >= 0 ? description.slice(0, i) : description).trim().replace(/^\*\*KR\*\*\s*/, '');
}

/** "한글 / English" 제목을 나눈다(옛 제목은 한 줄 그대로) */
export function splitTitle(title: string) {
  const [ko, ...rest] = title.split(' / ');
  return { ko: ko.trim(), en: rest.join(' / ').trim() || null };
}

export const blocks: Block[] = (archiveJson.blocks as RawBlock[])
  .filter((b) => b.type === 'Image' && b.no != null && b.image)
  .map((b) => ({
    id: b.id,
    no: b.no as number,
    title: b.title,
    week: b.week,
    description: b.description,
    image: b.image as Block['image'],
    url: b.url,
    analysis: analysis[b.no as number],
    pushed: b.description.includes(`\n---\n${EN_MARKER}`),
  }));

export const expressionList = (archiveJson.blocks as RawBlock[]).find((b) => b.type === 'Text' && /expression/i.test(b.title));

/** 개념 id → 그 개념이 붙은 블록들 */
export const blocksByConcept: Record<string, Block[]> = {};
for (const b of blocks) for (const c of b.analysis?.concepts ?? []) (blocksByConcept[c] ??= []).push(b);

/** 장 id → 그 장의 개념이 하나라도 붙은 블록들(번호 순, 중복 없이) */
export const blocksByChapter: Record<string, Block[]> = Object.fromEntries(
  chapters.map((ch) => {
    const set = new Map<number, Block>();
    for (const c of ch.concepts) for (const b of blocksByConcept[c.id] ?? []) set.set(b.no, b);
    return [ch.id, [...set.values()].sort((a, z) => a.no - z.no)];
  }),
);

export const checkLabels = {
  ok: { ko: '책과 일치', en: 'Aligned' },
  expand: { ko: '보완 제안', en: 'Expand' },
  revise: { ko: '용어 점검', en: 'Revise' },
} as const;

export const conceptCount = chapters.reduce((n, ch) => n + ch.concepts.length, 0);

/** 용어집 앵커 */
export const termAnchor = (id: string) => `term-${id.replace(/\./g, '-')}`;
