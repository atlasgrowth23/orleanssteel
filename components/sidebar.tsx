'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, Layers, User } from 'lucide-react'
import { cn } from '@/lib/cn'

const navigation = [
  { name: 'Permits', href: '/permits', icon: FileText },
  { name: 'Pipelines', href: '/pipelines', icon: Layers },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">Steel Leads</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Avatar */}
      <div className="p-4 border-t border-border bg-muted/50">
        <div className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="text-sm">
            <div className="font-medium text-foreground">User</div>
            <div className="text-muted-foreground">user@example.com</div>
          </div>
        </div>
      </div>
    </div>
  )
}
