'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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
        <div className="text-center">
          <div className="font-semibold text-gray-900">{card.company}</div>
        </div>
      </CardContent>
    </Card>
  )
}
