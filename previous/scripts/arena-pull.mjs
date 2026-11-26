// Pull the AL channel from Are.na.
//
//   npm run arena:pull              → backup + content/archive.json
//   npm run arena:pull -- --images  → also download each image (data/images/, not committed)
//
// 1. data/backup/channel-<date>.json — the channel and every block as the API returns them
// 2. content/archive.json            — the trimmed list the study site reads (number, week, text, image links)
//
// Weeks are counted in 7-day steps from the first class day (WEEK_ONE) by each block's creation date.
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { arena, arenaAll, CHANNEL, ROOT } from './arena.mjs';

const WEEK_ONE = Date.parse('2026-09-08T00:00:00+09:00');
const weekOf = (iso) => `WK${String(Math.floor((Date.parse(iso) - WEEK_ONE) / (7 * 864e5)) + 1).padStart(2, '0')}`;

const today = new Date().toISOString().slice(0, 10);
const withImages = process.argv.includes('--images');

const channel = await arena(`/channels/${CHANNEL}`);
const blocks = await arenaAll(`/channels/${CHANNEL}/contents?sort=position_asc`);
console.log(`${channel.title.trim()} — ${blocks.length} blocks`);

mkdirSync(join(ROOT, 'data/backup'), { recursive: true });
writeFileSync(join(ROOT, `data/backup/channel-${today}.json`), JSON.stringify({ channel, blocks }, null, 2) + '\n');

const archive = blocks.map((b) => {
  // "12. Cosmic" → no 12, title "Cosmic"; text blocks have no number
  const m = (b.title || '').match(/^(\d+)\.\s*(.*)$/);
  return {
    id: b.id,
    type: b.type,
    no: m ? Number(m[1]) : null,
    title: m ? m[2].trim() : (b.title || '').trim(),
    week: weekOf(b.created_at),
    created: b.created_at,
    description: b.description?.markdown ?? '',
    content: b.type === 'Text' ? (b.content?.markdown ?? '') : undefined,
    altText: b.image?.alt_text ?? null,
    metadata: b.metadata ?? null,
    image: b.image
      ? {
          width: b.image.width,
          height: b.image.height,
          small: b.image.small?.src,
          medium: b.image.medium?.src,
          large: b.image.large?.src,
        }
      : null,
    url: `https://www.are.na/block/${b.id}`,
  };
});

writeFileSync(
  join(ROOT, 'content/archive.json'),
  JSON.stringify({ channel: { id: channel.id, slug: channel.slug, title: channel.title.trim(), url: `https://www.are.na/${channel.owner?.slug ?? 'hkthx8f9-u0'}/${channel.slug}`, pulled: today }, blocks: archive }, null, 2) + '\n',
);
console.log('wrote content/archive.json and', `data/backup/channel-${today}.json`);

// Scores saved on Are.na (metadata.score) fill in any block that has no local score yet
const scoresPath = join(ROOT, 'content/scores.json');
const scores = existsSync(scoresPath) ? JSON.parse(readFileSync(scoresPath, 'utf8')) : {};
let filled = 0;
for (const b of archive) {
  const s = b.metadata?.score;
  if (b.no != null && Number.isInteger(s) && scores[b.no] == null) {
    scores[b.no] = s;
    filled++;
  }
}
if (filled) {
  writeFileSync(scoresPath, JSON.stringify(Object.fromEntries(Object.entries(scores).sort(([a], [z]) => a - z)), null, 2) + '\n');
  console.log(`filled ${filled} score(s) from Are.na into content/scores.json`);
}

if (withImages) {
  mkdirSync(join(ROOT, 'data/images'), { recursive: true });
  for (const b of archive) {
    if (!b.image) continue;
    const file = join(ROOT, 'data/images', `${String(b.no).padStart(2, '0')}-${b.id}.webp`);
    if (existsSync(file)) continue;
    const res = await fetch(b.image.medium);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    console.log('  image', b.no, b.title);
  }
}
