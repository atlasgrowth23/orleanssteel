'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Table, Map } from 'lucide-react'

export function NavigationTabs() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Preserve current search params when switching views
  const currentParams = searchParams?.toString() || ''
  const queryString = currentParams ? `?${currentParams}` : ''

  const tabs = [
    {
      name: 'Table View',
      href: `/permits${queryString}`,
      icon: Table,
      current: pathname === '/permits'
    },
    {
      name: 'Map View', 
      href: `/permits/map${queryString}`,
      icon: Map,
      current: pathname === '/permits/map'
    }
  ]

  return (
    <div className="border-b border-border bg-background">
      <div className="px-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  tab.current
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}