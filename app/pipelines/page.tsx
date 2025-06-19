'use client'

import { useState } from 'react'
import { PipelineSelector } from '@/components/pipelines/pipeline-selector'
import { KanbanBoard } from '@/components/pipelines/kanban-board'
import stubPipelines from '@/data/stub-pipelines.json'

export default function PipelinesPage() {
  const [selectedPipeline, setSelectedPipeline] = useState('fence-mobile')

  const pipelineData = stubPipelines.find(p => p.id === selectedPipeline) || stubPipelines[0]

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Pipeline Management</h1>
        <PipelineSelector
          selectedPipeline={selectedPipeline}
          onPipelineChange={setSelectedPipeline}
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <KanbanBoard pipeline={pipelineData} />
      </div>
    </div>
  )
}
