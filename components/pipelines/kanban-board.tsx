'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { PipelineCard } from './pipeline-card'
import { CardDrawer } from './card-drawer'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PipelineData, PipelineCard as PipelineCardType } from '@/types'

const columns = ['new', 'queued', 'contacted', 'follow-up', 'done']
const columnTitles = {
  new: 'New',
  queued: 'Queued', 
  contacted: 'Contacted',
  'follow-up': 'Follow-Up',
  done: 'Done'
}

interface KanbanBoardProps {
  pipeline: PipelineData
}

export function KanbanBoard({ pipeline }: KanbanBoardProps) {
  const [cards, setCards] = useState(pipeline.cards)
  const [activeCard, setActiveCard] = useState<PipelineCardType | null>(null)
  const [selectedCard, setSelectedCard] = useState<PipelineCardType | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const card = cards.find(c => c.id === active.id)
    setActiveCard(card || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) return

    const activeCard = cards.find(c => c.id === active.id)
    if (!activeCard) return

    const overColumn = over.id as string

    if (activeCard.status !== overColumn) {
      setCards(prevCards =>
        prevCards.map(card =>
          card.id === activeCard.id
            ? { ...card, status: overColumn }
            : card
        )
      )
    }

    setActiveCard(null)
  }

  const getCardsForColumn = (status: string) => {
    return cards.filter(card => card.status === status)
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-5 gap-6 h-full bg-background">
          {columns.map(status => {
            const columnCards = getCardsForColumn(status)
            
            return (
              <Card key={status} className="flex flex-col h-full bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground text-center">
                    {columnTitles[status as keyof typeof columnTitles]}
                    <span className="ml-2 text-xs bg-muted rounded-full px-2 py-1 text-muted-foreground">
                      {columnCards.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto">
                  <SortableContext
                    items={columnCards.map(card => card.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {columnCards.map(card => (
                        <PipelineCard
                          key={card.id}
                          card={card}
                          onClick={() => setSelectedCard(card)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <DragOverlay>
          {activeCard ? (
            <PipelineCard card={activeCard} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>

      <CardDrawer
        card={selectedCard}
        open={!!selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </>
  )
}
