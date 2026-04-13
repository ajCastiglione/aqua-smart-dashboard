import type { ReactNode } from 'react'
import { Header } from './Header'

type AppShellProps = {
  children: ReactNode
}

export const AppShell = ({ children }: AppShellProps) => (
  <div className="min-h-screen bg-pool bg-cover bg-center bg-no-repeat">
    <div className="min-h-screen bg-gradient-to-b from-sky-900/75 via-sky-800/80 to-[#0a1a2e]/95">
      <Header />
      <main className="mx-auto max-w-7xl px-3 pb-12 pt-4 sm:px-4 lg:px-8">{children}</main>
    </div>
  </div>
)
