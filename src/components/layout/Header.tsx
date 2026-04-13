import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${
    isActive ? 'bg-white/20 text-white' : 'text-sky-100 hover:bg-white/10'
  }`

export const Header = () => {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-white/10 bg-[#0c2340]/90 shadow-md backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <button
            type="button"
            className="inline-flex rounded-md p-2 text-white hover:bg-white/10 md:hidden"
            aria-expanded={open}
            aria-label="Open menu"
            onClick={() => setOpen((isOpen) => !isOpen)}
          >
            <span className="sr-only">Menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <div className="flex min-w-0 items-center gap-3">
            <span className="truncate text-xs font-bold uppercase tracking-wider text-amber-200 sm:text-sm">
              Pinch-A-Penny
            </span>
            <span className="hidden h-6 w-px bg-white/30 sm:block" aria-hidden />
            <span className="truncate font-semibold text-white sm:text-lg">aquasmart</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative rounded-full p-2 text-white opacity-60 hover:bg-white/10"
            disabled
            title="Notifications (prototype)"
            aria-label="Notifications"
          >
            <span
              className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"
              aria-hidden
            />
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
          <button
            type="button"
            className="rounded-lg bg-sky-500/90 px-3 py-1.5 text-xs font-semibold text-white opacity-60 sm:text-sm"
            disabled
            title="Add new (read-only prototype)"
          >
            Add New
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-white opacity-60 hover:bg-white/10"
            disabled
            title="Settings (prototype)"
            aria-label="Settings"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.46-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.18-.07-.37 0-.49.22l-1.92 3.32c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.58 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
          </button>
        </div>
      </div>
      <nav
        className={`border-t border-white/10 md:block ${open ? 'block' : 'hidden'}`}
        aria-label="Primary"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-3 py-2 sm:flex-row sm:px-4 lg:px-8">
          <NavLink to="/" className={navLinkClass} end onClick={() => setOpen(false)}>
            Customers
          </NavLink>
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-sm text-sky-200/80 hover:bg-white/10"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
        </div>
      </nav>
    </header>
  )
}
