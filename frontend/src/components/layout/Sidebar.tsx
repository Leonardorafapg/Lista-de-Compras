import { NavLink } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/cn'
import { NAV_ITEMS } from '@/components/layout/navItems'

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface px-4 py-6 md:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex size-8 items-center justify-center rounded-control bg-accent text-white">
          <ShoppingCart className="size-4" />
        </div>
        <span className="text-sm font-semibold text-ink">Lista de Compras</span>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-control px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-accent-soft text-accent' : 'text-ink-soft hover:bg-ink/5 hover:text-ink',
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
