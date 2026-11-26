import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'

/**
 * 채점 모드(npm run dev에서만): 아카이브 상세 창의 1–10 버튼이 POST /__al/score { key, score }를 보내면
 * content/scores.json에 저장한다. 배포된 사이트에는 이 주소가 없으므로 점수는 읽기만 된다.
 * Are.na에는 `npm run arena:scores -- --apply`로 블록 메타데이터(score)에 반영한다.
 */
const SCORES = 'content/scores.json'

function scoreEditor(): Plugin {
  return {
    name: 'al-score-editor',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__al/score', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          return res.end()
        }
        let body = ''
        req.on('data', (chunk) => (body += chunk))
        req.on('end', () => {
          try {
            // key: 메인 채널 블록은 번호("12"), Color 컬렉션 블록은 "c3"
            const { key, score } = JSON.parse(body) as { key: string; score: number | null }
            if (!/^c?\d+$/.test(String(key))) throw new Error('key must be a block number or c<number>')
            const scores = JSON.parse(readFileSync(SCORES, 'utf8')) as Record<string, number>
            if (score == null) delete scores[key]
            else if (Number.isInteger(score) && score >= 1 && score <= 10) scores[key] = score
            else throw new Error('score must be an integer 1–10')
            // 번호 키 먼저(숫자순), 그다음 c 키(숫자순)
            const rank = (k: string) => (k.startsWith('c') ? 1e6 : 0) + Number(k.replace('c', ''))
            const sorted = Object.fromEntries(Object.entries(scores).sort(([a], [b]) => rank(a) - rank(b)))
            writeFileSync(SCORES, JSON.stringify(sorted, null, 2) + '\n')
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(sorted))
          } catch (e) {
            res.statusCode = 400
            res.end(String(e))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), scoreEditor()],
  // GitHub Pages serves this repo from /AL/
  base: command === 'build' ? '/AL/' : '/',
  // 점수를 저장할 때마다 페이지가 새로 고쳐지지 않게
  server: { watch: { ignored: ['**/content/scores.json'] } },
}))
