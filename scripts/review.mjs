// Write the block review sheet (review/blocks-review.md) from content/analysis.ts.
// 블록마다: 기존 한국어 설명 · 제안 영어 설명 · 라우어 개념 · 점검 메모 — 승인 체크박스와 함께.
//
//   npm run review
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './arena.mjs';
import { analysis } from '../content/analysis.ts';
import { conceptIndex, termMap } from '../content/book.ts';

const { channel, blocks } = JSON.parse(readFileSync(join(ROOT, 'content/archive.json'), 'utf8'));
const label = { ok: '책과 일치', expand: '보완 제안', revise: '용어 점검' };
const korean = (d) => {
  const i = d.indexOf('\n---\n**EN**');
  return (i >= 0 ? d.slice(0, i) : d).trim();
};

const rows = blocks.filter((b) => analysis[b.no]);
const count = (k) => rows.filter((b) => analysis[b.no].check === k).length;

let md = `# 블록 점검표

- 채널: [${channel.title}](${channel.url}) · 가져온 날 ${channel.pulled}
- 기준: 『Design Basics』 9판(Pentak & Lauer, 2016)
- 결과: 책과 일치 ${count('ok')} · 보완 제안 ${count('expand')} · 용어 점검 ${count('revise')} (총 ${rows.length})

승인할 블록의 \`[ ]\`를 \`[x]\`로 바꾸거나, 채팅으로 번호를 알려 주세요. 승인된 블록만 \`node scripts/arena-push.mjs --only <번호> --apply\`로 Are.na에 반영합니다.
반영되는 것: 한국어 설명 아래에 \`---\` + 영어 설명 + 라우어 개념 한 줄, 그리고 이미지 대체 텍스트(alt text). 한국어 원문은 바꾸지 않습니다.

## 용어 바로잡기 기준

| 쓴 표현 | 책의 용어 | 쪽 |
|---|---|---|
${termMap.map((t) => `| ${t.said} | ${t.book} | ${conceptIndex[t.concept].page} |`).join('\n')}

`;

for (const week of [...new Set(rows.map((b) => b.week))]) {
  md += `\n## ${week}\n`;
  for (const b of rows.filter((x) => x.week === week)) {
    const a = analysis[b.no];
    md += `
### [ ] ${b.no}. ${b.title} — ${label[a.check]}

![${b.title}](${b.image.small})

**기존 설명**

> ${korean(b.description).replace(/\n+/g, '\n> ')}

**영어 설명(제안)**

> ${a.en}

**라우어 개념** ${a.concepts.map((id) => `${conceptIndex[id].ko}(${conceptIndex[id].en}, p.${conceptIndex[id].page})`).join(' · ')}

**점검 메모**

${a.notes.map((n) => `- ${n}`).join('\n')}

[Are.na에서 보기](${b.url})
`;
  }
}

mkdirSync(join(ROOT, 'review'), { recursive: true });
writeFileSync(join(ROOT, 'review/blocks-review.md'), md);
console.log(`review/blocks-review.md — ${rows.length} blocks`);
