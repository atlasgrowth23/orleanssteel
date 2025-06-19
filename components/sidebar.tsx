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
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary">Steel Leads</h1>
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
                'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Avatar */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 px-4 py-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          <div className="text-sm">
            <div className="font-medium text-gray-900">User</div>
            <div className="text-gray-500">user@example.com</div>
          </div>
        </div>
      </div>
    </div>
  )
}
