# Aesthetic Literacy

데이비드 라우어 · 스티븐 펜탁 『Design Basics』 9판(2016)을 바탕으로 정리한 **AL(Aesthetic Literacy) 학습 자료**와, Are.na에 모은 이미지를 책의 개념으로 분석한 **아카이브**입니다.

- 학습 사이트: https://yongzu.github.io/AL/
- Are.na 채널: https://www.are.na/hkthx8f9-u0/1-aesthetic-literacy-qhm68ahvlpk

> 책의 원문과 도판은 저장소에 넣지 않습니다. 모든 설명은 직접 정리한 요약이며, 쪽수로 출처를 표시합니다.

## 구조

```
AL/
├── content/                  ← 단일 원본: 사이트와 스크립트가 함께 읽는다
│   ├── types.ts              ← 장 · 개념 · 블록 분석의 타입
│   ├── chapters-principles.ts← 1–6장(디자인 과정 · 원리) 요약, 개념, 헷갈리는 점, 질문, 퀴즈
│   ├── chapters-elements.ts  ← 7–13장(디자인 요소)
│   ├── book.ts               ← 책 정보, 분석 순서, 수업 표현 → 책 용어 표, 주차
│   ├── analysis.ts           ← 블록 58개의 영어 설명 · 개념 태그 · 점검 메모
│   └── archive.json          ← Are.na에서 가져온 블록 목록(npm run arena:pull)
├── src/                      ← 학습 사이트(BI와 같은 React · Vite · 디자인 토큰)
├── scripts/
│   ├── arena.mjs             ← Are.na v3 API 클라이언트(.env의 토큰 사용)
│   ├── arena-pull.mjs        ← 채널 백업 + content/archive.json 갱신
│   ├── arena-push.mjs        ← 승인된 분석을 Are.na에 반영(기본은 미리 보기만)
│   ├── review.mjs            ← review/blocks-review.md 점검표 만들기
│   └── deploy.mjs            ← GitHub Pages(gh-pages 브랜치) 배포
├── review/                   ← 점검표 · 반영 기록
├── data/backup/              ← 채널 백업(JSON)
└── book/ · .env · data/images/  ← 업로드 제외(.gitignore)
```

## 작업 흐름

```bash
npm install
npm run arena:pull -- --images   # Are.na 채널 백업 + 이미지 내려받기
npm run review                   # 점검표 만들기 → review/blocks-review.md
npm run arena:push -- --only 6,38          # 미리 보기(아무것도 쓰지 않음)
npm run arena:push -- --only 6,38 --apply  # 승인한 블록만 Are.na에 반영
npm run dev                      # 사이트 로컬 확인
npm run deploy                   # https://yongzu.github.io/AL/ 에 배포
```

새 블록이 추가되면: `arena:pull` → `content/analysis.ts`에 분석 추가 → `review` → 승인 → `arena:push --apply` → `deploy`.

## Are.na에 반영되는 형식

한국어 원문은 그대로 두고, 그 아래에만 덧붙입니다.

```
<기존 한국어 설명>

---
**EN** <영어 설명>

**Lauer** Amplified Perspective (p.216) · Contrast of Scale (p.76) · …
```

이미지의 대체 텍스트(alt text)에도 영어 설명이 들어갑니다. `--connect`를 함께 주면 장별 채널(예: `AL · 02 Unity 통일`)을 만들고 블록을 연결합니다.

## 토큰

`.env`에 Are.na 개인 토큰을 둡니다(업로드 제외). 발급: https://www.are.na/developers/personal-access-tokens — Access level `write`.

```
ARENA_TOKEN=...
ARENA_CHANNEL=1-aesthetic-literacy-qhm68ahvlpk
```
