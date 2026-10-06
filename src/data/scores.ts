import { useSyncExternalStore } from 'react';
import initial from '../../content/scores.json';

/**
 * 내 점수(1–10) — content/scores.json이 원본.
 * 개발 서버(npm run dev)에서는 상세 창에서 바로 고치고 파일에 저장된다(vite.config.ts의 /__al/score).
 * 배포된 사이트에서는 읽기만 한다.
 */
export const canEditScores = import.meta.env.DEV;

let scores: Record<string, number> = { ...(initial as Record<string, number>) };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function useScores() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => scores,
  );
}

export async function setScore(no: number, score: number | null) {
  if (!canEditScores) return;
  const prev = scores;
  const next = { ...scores };
  if (score == null) delete next[no];
  else next[no] = score;
  scores = next; // 먼저 화면에 반영하고
  emit();
  try {
    const res = await fetch('/__al/score', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ no, score }) });
    if (!res.ok) throw new Error(await res.text());
    scores = await res.json(); // 파일에 저장된 값으로 맞춘다
  } catch (e) {
    console.error('점수 저장 실패', e);
    scores = prev;
  }
  emit();
}

export const average = (list: number[]) => (list.length ? Math.round((list.reduce((a, b) => a + b, 0) / list.length) * 10) / 10 : null);
