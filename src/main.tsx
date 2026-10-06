import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './smoothScroll'
import { StudyPage } from './pages/StudyPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StudyPage />
  </StrictMode>,
)
