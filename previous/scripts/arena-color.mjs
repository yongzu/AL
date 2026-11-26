// Write the Color collection (content/color.ts) to its own Are.na channel — separate from the main channel.
//
//   npm run arena:color            → dry run: prints what would change, writes nothing
//   npm run arena:color -- --apply → update title + description + alt text + metadata.score of each image,
//                                    replace the Expression List text block, save ids to content/color-arena.json
//
// Image blocks are matched to C01…C10 by the number at the start of their title ("3.png" or "C03. …"),
// and the image size must match content/color.ts — otherwise the script stops before writing.
// Description format is the same as the main channel (scripts/arena-push.mjs):
//
//   **KR** <한국어 설명>
//
//   ---
//   **EN** <English description>
//
//   **Lauer**
//   - 보색 배색 · Triadic/Complementary · p.280
//
//   **Score** 9 / 10
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { arena, arenaAll, ROOT } from './arena.mjs';
import { colorBlocks } from '../content/color.ts';
import { conceptIndex } from '../content/book.ts';

const SLUG = 'al-color';
const apply = process.argv.includes('--apply');

const scores = JSON.parse(readFileSync(join(ROOT, 'content/scores.json'), 'utf8'));
const expressionList = readFileSync(join(ROOT, 'content/expression-list-color.md'), 'utf8').replace(/\r\n/g, '\n').trim();
const label = (no) => `C${String(no).padStart(2, '0')}`;
const lauerLines = (ids) => ids.map((id) => `- ${conceptIndex[id].ko} · ${conceptIndex[id].en} · p.${conceptIndex[id].page}`).join('\n');

const channel = await arena(`/channels/${SLUG}`);
const contents = await arenaAll(`/channels/${SLUG}/contents`);
const images = contents.filter((b) => b.type === 'Image');
const text = contents.find((b) => b.type === 'Text' && /expression list/i.test(b.title ?? b.content?.plain ?? ''));

const plan = [];
for (const c of colorBlocks) {
  const found = images.filter((b) => Number((b.title ?? '').match(/^C?0*(\d+)[.]/)?.[1]) === c.no);
  if (found.length !== 1) throw new Error(`${label(c.no)}: ${found.length} matching image blocks on Are.na`);
  const b = found[0];
  if (b.image?.width !== c.width || b.image?.height !== c.height) {
    throw new Error(`${label(c.no)}: size ${b.image?.width}x${b.image?.height} on Are.na ≠ ${c.width}x${c.height} in content/color.ts`);
  }
  const score = scores[`c${c.no}`] ?? null;
  const title = `${label(c.no)}. ${c.title.ko} / ${c.title.en}`;
  // 줄 맨 앞의 "+ "(탁월성 표시)가 마크다운 목록이 되지 않게 이스케이프 — 화면에는 그대로 + 로 보인다
  const ko = c.ko.replace(/^\+ /gm, '\\+ ');
  const description = `**KR** ${ko}\n\n---\n**EN** ${c.analysis.en}\n\n**Lauer**\n${lauerLines(c.analysis.concepts)}${score != null ? `\n\n**Score** ${score} / 10` : ''}`;
  const current = typeof b.description === 'string' ? b.description : b.description?.markdown ?? '';
  const changed = title !== b.title || description !== current || (b.metadata?.score ?? null) !== score;
  plan.push({ no: c.no, id: b.id, oldTitle: b.title, title, description, alt: c.analysis.en, score, changed });
}

console.log(`${apply ? 'APPLY' : 'DRY RUN'} — ${channel.title} (${channel.id}) · ${plan.filter((p) => p.changed).length}/${plan.length} images to update\n`);
for (const p of plan) {
  console.log(`${label(p.no)}  #${p.id}  ${p.oldTitle} → ${p.title}${p.changed ? '' : '  (no change)'}${p.score != null ? `  · ${p.score}점` : ''}`);
}
const textChanged = text && (text.content?.markdown ?? '').trim() !== expressionList;
console.log(`\nExpression List  ${text ? `#${text.id}` : '(text block not found)'}${textChanged ? ` → ${expressionList.split('\n').length} lines` : '  (no change)'}`);

if (!apply) {
  console.log('\nNothing was written. Re-run with --apply after reviewing.');
  process.exit(0);
}

for (const p of plan) {
  if (!p.changed) continue;
  await arena(`/blocks/${p.id}`, { method: 'PUT', body: { title: p.title, description: p.description, alt_text: p.alt, metadata: { score: p.score } }, write: true });
  console.log(`  updated ${label(p.no)}`);
}
if (textChanged) {
  await arena(`/blocks/${text.id}`, { method: 'PUT', body: { title: 'Expression List', content: expressionList }, write: true });
  console.log('  updated Expression List');
}

// 사이트가 Are.na 링크를 걸 수 있게 채널 · 블록 id를 남긴다
const saved = {
  channel: { id: channel.id, slug: SLUG, title: channel.title, url: `https://www.are.na/${channel.owner?.slug ?? 'hkthx8f9-u0'}/${SLUG}` },
  expressionList: text?.id ?? null,
  blocks: Object.fromEntries(plan.map((p) => [p.no, p.id])),
  pushed: new Date().toISOString().slice(0, 10),
};
writeFileSync(join(ROOT, 'content/color-arena.json'), JSON.stringify(saved, null, 2) + '\n');
console.log('\nSaved content/color-arena.json');
