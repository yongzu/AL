// Write the approved block analysis back to Are.na.
//
//   node scripts/arena-push.mjs                  → dry run: prints what would change, writes nothing
//   node scripts/arena-push.mjs --only 1,2,3     → only these block numbers
//   node scripts/arena-push.mjs --apply          → really update title + description + alt text + metadata.score
//   node scripts/arena-push.mjs --connect        → (with --apply) also connect blocks to chapter channels
//
// Title: `번호. 한글 / English` from content/titles.ts (blocks without an entry keep their title).
// Description format (the Korean text itself is never edited — only the **KR** label and the part below `---`):
//
//   **KR** <기존 한국어 설명>
//
//   ---
//   **EN** <English description>
//
//   **Lauer**
//   - 증폭된 원근 · Amplified Perspective · p.216
//   - 스케일 대비 · Contrast of Scale · p.76
//
//   **Score** 9 / 10          ← content/scores.json에 점수가 있을 때만(metadata.score도 함께)
//
// Run `npm run arena:pull` first so the Korean text is the latest one on Are.na.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { arena, ROOT } from './arena.mjs';
import { analysis } from '../content/analysis.ts';
import { conceptIndex, chapters } from '../content/book.ts';
import { titles, blockTitle } from '../content/titles.ts';

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const connect = args.includes('--connect');
const onlyArg = args.find((a) => a.startsWith('--only'));
const only = onlyArg ? new Set((onlyArg.includes('=') ? onlyArg.split('=')[1] : args[args.indexOf(onlyArg) + 1]).split(',').map(Number)) : null;

const MARK = '\n\n---\n**EN** ';
const { blocks } = JSON.parse(readFileSync(join(ROOT, 'content/archive.json'), 'utf8'));

/** 한국어 원문만 — **KR** 표시와 --- 아래 영어 부분을 떼어 낸다(여러 번 실행해도 KR이 겹치지 않게) */
const korean = (d) => {
  const i = d.indexOf('\n---\n**EN**');
  return (i >= 0 ? d.slice(0, i) : d).trim().replace(/^\*\*KR\*\*\s*/, '');
};
/** 라우어 개념 — 한 줄에 하나씩 '한글 · English · 쪽수' */
const lauerLines = (ids) => ids.map((id) => `- ${conceptIndex[id].ko} · ${conceptIndex[id].en} · p.${conceptIndex[id].page}`).join('\n');
const scores = JSON.parse(readFileSync(join(ROOT, 'content/scores.json'), 'utf8'));

const plan = [];
for (const b of blocks) {
  const a = analysis[b.no];
  if (!a || (only && !only.has(b.no))) continue;
  const score = scores[b.no] ?? null;
  const next = `**KR** ${korean(b.description)}${MARK}${a.en}\n\n**Lauer**\n${lauerLines(a.concepts)}${score != null ? `\n\n**Score** ${score} / 10` : ''}`;
  const chapterIds = [...new Set(a.concepts.map((id) => conceptIndex[id].chapter.id))];
  const current = `${b.no}. ${b.title}`;
  const title = titles[b.no] ? blockTitle(b.no) : current;
  plan.push({ id: b.id, no: b.no, title, oldTitle: current, changed: next !== b.description || title !== current || (b.metadata?.score ?? null) !== score, description: next, score, alt: a.en, chapterIds });
}

console.log(`${apply ? 'APPLY' : 'DRY RUN'} — ${plan.length} blocks, ${plan.filter((p) => p.changed).length} to update\n`);
for (const p of plan) {
  console.log(`#${p.no} ${p.title}${p.changed ? '' : '  (no change)'}`);
  if (p.title !== p.oldTitle) console.log(`   was   ${p.oldTitle}`);
  console.log(`   EN    ${p.alt.slice(0, 110)}${p.alt.length > 110 ? '…' : ''}`);
  console.log(`   장    ${p.chapterIds.join(', ')}`);
}

if (!apply) {
  console.log('\nNothing was written. Re-run with --apply after reviewing.');
  process.exit(0);
}

// ---------- write ----------
const log = [];
for (const p of plan) {
  if (!p.changed) continue;
  await arena(`/blocks/${p.id}`, { method: 'PUT', body: { title: p.title, description: p.description, alt_text: p.alt, metadata: { score: p.score } }, write: true });
  log.push({ no: p.no, id: p.id, at: new Date().toISOString() });
  console.log(`  updated #${p.no}`);
}

if (connect) {
  // One channel per chapter, created on first use: "AL · 02 Unity 통일"
  const me = await arena('/me');
  const titleOf = (ch) => `AL · ${String(ch.no).padStart(2, '0')} ${ch.en} ${ch.ko}`;
  const cachePath = join(ROOT, 'data/arena-channels.json');
  let cache = {};
  try { cache = JSON.parse(readFileSync(cachePath, 'utf8')); } catch { /* first run */ }
  for (const ch of chapters) {
    const needed = plan.some((p) => p.chapterIds.includes(ch.id));
    if (!needed || cache[ch.id]) continue;
    const created = await arena('/channels', {
      method: 'POST',
      write: true,
      body: { title: titleOf(ch), visibility: 'public', description: `『Design Basics』 9판 ${ch.no}장 ${ch.ko}(${ch.en}, p.${ch.pages[0]}–${ch.pages[1]}). ${ch.oneLine}` },
    });
    cache[ch.id] = { id: created.id, slug: created.slug, owner: me.slug };
    console.log(`  channel ${titleOf(ch)} → ${created.slug}`);
  }
  mkdirSync(join(ROOT, 'data'), { recursive: true });
  writeFileSync(cachePath, JSON.stringify(cache, null, 2) + '\n');
  for (const p of plan) {
    const ids = p.chapterIds.map((id) => cache[id]?.id).filter(Boolean);
    if (!ids.length) continue;
    try {
      await arena('/connections', { method: 'POST', write: true, body: { connectable_id: p.id, connectable_type: 'Block', channel_ids: ids } });
      console.log(`  connected #${p.no} → ${p.chapterIds.join(', ')}`);
    } catch (e) {
      console.warn(`  #${p.no}: ${e.message}`); // already connected, etc.
    }
  }
}

mkdirSync(join(ROOT, 'review'), { recursive: true });
writeFileSync(join(ROOT, `review/push-log-${new Date().toISOString().slice(0, 10)}.json`), JSON.stringify(log, null, 2) + '\n');
console.log('\nDone. Run `npm run arena:pull` to refresh content/archive.json.');
