# AL 프로젝트 — Claude 작업 규칙

Aesthetic Literacy 학습 사이트(https://yongzu.github.io/AL/)와 Are.na 채널(`1-aesthetic-literacy-qhm68ahvlpk`) 분석 저장소. 구조와 명령어는 README.md 참고.

## 지켜야 할 것

- **저작권:** `book/`(『Design Basics』 9판 PDF · 추출 원문)은 읽기만 하고 절대 커밋하지 않는다. 사이트 · content에는 직접 요약한 글과 쪽수만 쓴다. 원문을 길게 옮기지 않는다.
- **토큰:** `.env`의 `ARENA_TOKEN`은 출력하거나 커밋하지 않는다. 스크립트(scripts/arena.mjs)만 읽는다.
- **Are.na의 한국어 원문은 바꾸지 않는다.** 영어 설명은 `---` 아래에만 덧붙인다(arena-push.mjs 형식).
- **점수(1–10)는 사용자가 매긴다.** Claude는 점수를 정하지 않는다. 채점은 `npm run dev` → 아카이브 → 이미지 → 1–10 버튼(content/scores.json에 저장).
- 학습 자료 문장은 95% 한국어. 사이트 디자인은 yongzu/BI의 토큰 · 컴포넌트를 따른다.

## "새 블록 처리해줘"

사용자가 이 말을 하면 아래를 순서대로 끝까지 진행하고, 마지막에 처리한 블록과 점검 결과를 채팅으로 요약한다.

1. **가져오기** — `npm run arena:pull -- --images` 로 content/archive.json을 갱신하고, content/analysis.ts에 없는 이미지 블록 번호를 찾는다. 텍스트 블록(Expression List)이 바뀌었으면 사이트의 주차 표현도 확인한다.
2. **분석** — 새 블록마다 `data/images/`의 이미지를 직접 보고, 기존 한국어 설명을 읽은 뒤 content/analysis.ts에 추가한다.
   - `en`: 2–3문장 영어 설명(무엇이 보이는지 → 어떤 조형 장치 → 효과)
   - `concepts`: content/chapters-*.ts의 개념 id 3–4개(존재하는 id만)
   - `check`: ok · expand · revise, `notes`: 책 쪽수를 단 한국어 점검 메모(content/book.ts의 termMap 기준 포함: 강제 원근법 → 증폭된 원근 등)
   - 주차가 새로 시작되면 content/book.ts의 `weeks`에 주제를 추가한다(Expression List 기준).
3. **컬렉션** — content/collections.ts에서 맞는 컬렉션의 `blocks`에 번호를 더한다. 맞는 것이 없고 같은 소재 · 형식의 블록이 3개 이상 모이면 새 컬렉션을 만든다. 모든 블록은 최소 1개 컬렉션에 속한다.
4. **검증** — 개념 id 확인, `npx tsc -b`, `npm run review`.
5. **Are.na 반영** — 새 블록만:
   - `npm run arena:push -- --only <번호들>` 미리 보기 확인 후 `--apply`
   - `npm run arena:collections -- --apply` (새 채널 생성 · 연결)
   - 사용자가 점수를 매겨 두었으면 `npm run arena:scores -- --apply`
   - 끝나면 `npm run arena:pull` 로 다시 가져온다.
6. **배포** — 커밋 · `git push` · `npm run deploy`.

## 그 밖의 요청

- "점수 반영해줘" → `npm run arena:scores` 미리 보기 → `--apply` → `arena:pull` → 커밋 · 배포.
- 기존 블록의 영어 설명 반영은 사용자가 번호를 승인한 것만 `arena:push --only … --apply`.
