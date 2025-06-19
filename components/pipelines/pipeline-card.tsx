'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Building, MapPin, Phone, Mail } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { PipelineCard as PipelineCardType } from '@/types'

interface PipelineCardProps {
  card: PipelineCardType
  onClick?: () => void
  isDragging?: boolean
}

export function PipelineCard({ card, onClick, isDragging = false }: PipelineCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-pointer hover:shadow-md transition-shadow bg-white"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Company Name */}
          <div className="flex items-center space-x-2">
            <Building className="h-4 w-4 text-gray-500" />
            <span className="font-medium text-sm">{card.company}</span>
          </div>

          {/* City */}
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{card.city}</span>
          </div>

          {/* Contact Icons */}
          <div className="flex items-center space-x-3 pt-2">
            {card.phone && (
              <Phone className="h-4 w-4 text-primary" />
            )}
            {card.email && (
              <Mail className="h-4 w-4 text-primary" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
