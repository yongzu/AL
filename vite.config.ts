import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'

/**
 * 채점 모드(npm run dev에서만): 아카이브 상세 창의 1–10 버튼이 POST /__al/score { no, score }를 보내면
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
            const { no, score } = JSON.parse(body) as { no: number; score: number | null }
            const scores = JSON.parse(readFileSync(SCORES, 'utf8')) as Record<string, number>
            if (score == null) delete scores[no]
            else if (Number.isInteger(score) && score >= 1 && score <= 10) scores[no] = score
            else throw new Error('score must be an integer 1–10')
            const sorted = Object.fromEntries(Object.entries(scores).sort(([a], [b]) => Number(a) - Number(b)))
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
