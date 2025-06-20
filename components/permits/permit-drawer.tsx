'use client'

import { format } from 'date-fns'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Permit } from '@/types'

interface PermitDrawerProps {
  permit: Permit | null
  open: boolean
  onClose: () => void
}

export function PermitDrawer({ permit, open, onClose }: PermitDrawerProps) {
  if (!open || !permit) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900 overflow-auto">
        {/* Header */}
        <div className="bg-primary px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Permit Details</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Permit Code</label>
                  <div className="mt-1 flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        backgroundColor: permit.steelCategory === 'Fencing & Gates' ? '#22c55e' :
                                       permit.steelCategory === 'Metal Roofing' ? '#3b82f6' :
                                       permit.steelCategory === 'Structural Steel' ? '#ef4444' :
                                       permit.steelCategory === 'General Construction' ? '#f59e0b' : '#6b7280'
                      }}
                    ></div>
                    <Badge variant="outline">{permit.code}</Badge>
                    {permit.isSteelRelevant && (
                      <span className="text-sm text-green-600">{permit.steelCategory}</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Construction Value</label>
                  <div className="mt-1 text-lg font-semibold">
                    {permit.value ? `$${permit.value.toLocaleString()}` : 'N/A'}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <div className="mt-1 text-sm">{permit.address}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Contractor</label>
                  <div className="mt-1 text-sm">{permit.contractor || 'No contractor listed'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Distance</label>
                  <div className="mt-1 text-sm">{permit.distance ? `${permit.distance} miles` : 'N/A'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contractor Intelligence */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contractor Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 italic">
                Contractor analysis will be available in a future update.
              </div>
            </CardContent>
          </Card>

          {/* Location Intelligence */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 italic">
                Location analysis will be available in a future update.
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  )
}