/**
 * 사이트가 쓰는 데이터 — content/의 책 정리 + Are.na 아카이브(content/archive.json) + 블록 분석을 한데 묶는다.
 * 메인 채널과 분리한 Color 컬렉션(content/color.ts)도 여기서 같은 Block 꼴로 합친다.
 */
import archiveJson from '../../content/archive.json';
import { analysis, expressionSuggestions } from '../../content/analysis.ts';
import { book, chapters, conceptIndex, method, parts, sentencePattern, termMap, weeks } from '../../content/book.ts';
import { collections as arenaCollections, collectionTitle, type Collection } from '../../content/collections.ts';
import collectionChannels from '../../content/collections-arena.json';
import { colorBlocks, colorCollection } from '../../content/color.ts';
import colorArena from '../../content/color-arena.json';
import colorExpressionList from '../../content/expression-list-color.md?raw';
import type { BlockAnalysis, Chapter } from '../../content/types.ts';

export { book, chapters, conceptIndex, method, parts, sentencePattern, termMap, weeks, expressionSuggestions, collectionTitle, colorCollection, colorExpressionList };
export type { Chapter, Collection };

/** 컬렉션 id → Are.na 채널 주소(Color는 따로 만든 al-color 채널) */
export const collectionUrl = (id: string) =>
  id === colorCollection.id ? colorArena.channel.url : (collectionChannels as Record<string, { url: string }>)[id]?.url;

/** Color 컬렉션 블록의 키 — 메인 채널 번호와 겹치지 않게 c1, c2 … */
const colorKey = (no: number) => `c${no}`;

/**
 * 사이트에 보이는 컬렉션 — Are.na 태그 컬렉션(content/collections.ts) + 메인 채널과 분리한 Color 컬렉션.
 * keys는 블록 키(메인 채널은 번호 문자열, Color는 c1 …). separate는 ‘전체’ 보기에서 빠지는 컬렉션.
 */
export type SiteCollection = Collection & { keys: string[]; separate?: boolean };
export const collections: SiteCollection[] = [
  ...arenaCollections.map((c) => ({ ...c, keys: c.blocks.map(String) })),
  { id: colorCollection.id, ko: colorCollection.ko, en: colorCollection.en, body: colorCollection.body, blocks: [], keys: colorBlocks.map((b) => colorKey(b.no)), separate: true },
];

/** 블록 키 → 그 블록이 속한 컬렉션들 */
export const collectionsByBlock: Record<string, SiteCollection[]> = {};
for (const c of collections) for (const key of c.keys) (collectionsByBlock[key] ??= []).push(c);

type RawBlock = (typeof archiveJson.blocks)[number];

export type Block = {
  id: number | string;
  no: number;
  /** 점수 · 컬렉션 키 — 메인 채널은 번호 문자열, Color 컬렉션은 c1 … */
  key: string;
  /** 화면에 보이는 번호 — 01 · C01 */
  label: string;
  /** arena = 메인 Are.na 채널, color = 따로 모은 Color 컬렉션(아직 Are.na에 없음) */
  source: 'arena' | 'color';
  title: string;
  week: string;
  description: string;
  image: { width: number; height: number; small: string; medium: string; large: string };
  /** Are.na 블록 주소 — Color 블록은 올리기 전이라 비어 있다 */
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

/** 메인 Are.na 채널의 이미지 블록 */
export const arenaBlocks: Block[] = (archiveJson.blocks as RawBlock[])
  .filter((b) => b.type === 'Image' && b.no != null && b.image)
  .map((b) => ({
    id: b.id,
    no: b.no as number,
    key: String(b.no),
    label: String(b.no).padStart(2, '0'),
    source: 'arena' as const,
    title: b.title,
    week: b.week,
    description: b.description,
    image: b.image as Block['image'],
    url: b.url,
    analysis: analysis[b.no as number],
    pushed: b.description.includes(`\n---\n${EN_MARKER}`),
  }));

/** Color 컬렉션 블록 — 이미지는 public/color/, Are.na 블록 id는 content/color-arena.json(npm run arena:color가 갱신) */
const colorIds = colorArena.blocks as Record<string, number>;
const colorSrc = (file: string) => `${import.meta.env.BASE_URL}color/${file}`;
export const colorArchive: Block[] = colorBlocks.map((b) => ({
  id: colorKey(b.no),
  no: b.no,
  key: colorKey(b.no),
  label: `C${String(b.no).padStart(2, '0')}`,
  source: 'color' as const,
  title: `${b.title.ko} / ${b.title.en}`,
  week: colorCollection.week,
  description: b.ko,
  image: { width: b.width, height: b.height, small: colorSrc(b.file), medium: colorSrc(b.file), large: colorSrc(b.file) },
  url: colorIds[b.no] ? `https://www.are.na/block/${colorIds[b.no]}` : '',
  analysis: b.analysis,
  pushed: colorArena.pushed != null,
}));

/** 사이트의 모든 이미지 블록(메인 채널 + Color) */
export const blocks: Block[] = [...arenaBlocks, ...colorArchive];

export const expressionList = (archiveJson.blocks as RawBlock[]).find((b) => b.type === 'Text' && /expression/i.test(b.title));

/** 개념 id → 그 개념이 붙은 블록들 */
export const blocksByConcept: Record<string, Block[]> = {};
for (const b of blocks) for (const c of b.analysis?.concepts ?? []) (blocksByConcept[c] ??= []).push(b);

/** 장 id → 그 장의 개념이 하나라도 붙은 블록들(메인 채널 번호 순 → Color, 중복 없이) */
export const blocksByChapter: Record<string, Block[]> = Object.fromEntries(
  chapters.map((ch) => {
    const set = new Map<string, Block>();
    for (const c of ch.concepts) for (const b of blocksByConcept[c.id] ?? []) set.set(b.key, b);
    return [ch.id, [...set.values()].sort((a, z) => (a.source === z.source ? a.no - z.no : a.source === 'arena' ? -1 : 1))];
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
