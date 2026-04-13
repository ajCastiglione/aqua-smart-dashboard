import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { QueryProvider } from './providers/QueryProvider'
import './index.css'
import './styles/global.scss'

const routerBasename =
  import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <BrowserRouter basename={routerBasename}>
        <App />
      </BrowserRouter>
    </QueryProvider>
  </StrictMode>,
)
