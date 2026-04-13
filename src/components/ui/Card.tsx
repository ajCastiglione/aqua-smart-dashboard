import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
  title?: string
}

export const Card = ({ children, className = '', title }: CardProps) => (
  <div className={`rounded-xl border border-white/20 bg-white/95 p-4 shadow-lg backdrop-blur-sm ${className}`}>
    {title ? <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3> : null}
    {children}
  </div>
)
