// Create the tag-collection channels on Are.na and connect blocks to them.
//
//   node scripts/arena-collections.mjs            → dry run: what would be created / connected
//   node scripts/arena-collections.mjs --apply    → create missing channels, connect missing blocks
//
// Channel ids are kept in content/collections-arena.json (the study site links to them).
// Safe to re-run: existing channels are reused and blocks already in a channel are skipped.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { arena, arenaAll, ROOT } from './arena.mjs';
import { collections, collectionTitle } from '../content/collections.ts';

const apply = process.argv.includes('--apply');
const mapPath = join(ROOT, 'content/collections-arena.json');
const { channel: main, blocks } = JSON.parse(readFileSync(join(ROOT, 'content/archive.json'), 'utf8'));
const idOf = Object.fromEntries(blocks.filter((b) => b.no != null).map((b) => [b.no, b.id]));

let map = {};
try { map = JSON.parse(readFileSync(mapPath, 'utf8')); } catch { /* first run */ }

const me = await arena('/me');
console.log(`${apply ? 'APPLY' : 'DRY RUN'} — ${collections.length} collections\n`);

for (const c of collections) {
  const title = collectionTitle(c);
  let entry = map[c.id];

  if (!entry) {
    if (!apply) {
      console.log(`+ channel  ${title}  (${c.blocks.length} blocks)`);
      continue;
    }
    const created = await arena('/channels', {
      method: 'POST',
      write: true,
      body: {
        title,
        visibility: 'closed',
        description: `${c.body}\n\n[${main.title}](${main.url}) 채널의 이미지를 소재 · 형식으로 묶은 컬렉션.`,
      },
    });
    entry = map[c.id] = { id: created.id, slug: created.slug, url: `https://www.are.na/${me.slug}/${created.slug}` };
    writeFileSync(mapPath, JSON.stringify(map, null, 2) + '\n');
    console.log(`+ channel  ${title} → ${entry.url}`);
  }

  // which blocks are already in the channel
  const present = new Set((await arenaAll(`/channels/${entry.id}/contents`)).map((b) => b.id));
  for (const no of c.blocks) {
    const id = idOf[no];
    if (!id) {
      console.warn(`  ! #${no} not in archive.json`);
      continue;
    }
    if (present.has(id)) continue;
    if (!apply) {
      console.log(`    connect #${no} → ${c.ko}`);
      continue;
    }
    await arena('/connections', { method: 'POST', write: true, body: { connectable_id: id, connectable_type: 'Block', channel_ids: [entry.id] } });
    console.log(`    connected #${no} → ${c.ko}`);
  }
}

if (!apply) console.log('\nNothing was written. Re-run with --apply.');
