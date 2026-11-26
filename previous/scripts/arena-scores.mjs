// Send my 1–10 scores (content/scores.json) to Are.na as block metadata `score`.
//
//   npm run arena:scores              → dry run
//   npm run arena:scores -- --apply   → write metadata (merge: other metadata keys are kept)
//
// A score removed locally is removed on Are.na too (score: null).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { arena, ROOT } from './arena.mjs';

const apply = process.argv.includes('--apply');
const scores = JSON.parse(readFileSync(join(ROOT, 'content/scores.json'), 'utf8'));
const { blocks } = JSON.parse(readFileSync(join(ROOT, 'content/archive.json'), 'utf8'));

const changes = [];
for (const b of blocks) {
  if (b.no == null) continue;
  const local = scores[b.no] ?? null;
  const remote = b.metadata?.score ?? null;
  if (local !== remote) changes.push({ b, local, remote });
}

console.log(`${apply ? 'APPLY' : 'DRY RUN'} — ${changes.length} score change(s)`);
for (const { b, local, remote } of changes) {
  console.log(`  #${b.no} ${b.title}: ${remote ?? '–'} → ${local ?? '–'}`);
  if (apply) await arena(`/blocks/${b.id}`, { method: 'PUT', write: true, body: { metadata: { score: local } } });
}
if (!apply && changes.length) console.log('\nNothing was written. Re-run with --apply.');
if (apply && changes.length) console.log('\nDone. Run `npm run arena:pull` to refresh content/archive.json.');
