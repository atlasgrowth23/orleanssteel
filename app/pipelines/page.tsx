'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { PipelineSelector } from '@/components/pipelines/pipeline-selector'
import { KanbanBoard } from '@/components/pipelines/kanban-board'
import { getContractorPipelines } from '@/lib/supabase'
import stubPipelines from '@/data/stub-pipelines.json'

export default function PipelinesPage() {
  const searchParams = useSearchParams()
  const selectedPipelineId = searchParams.get('pipeline') || 'fence-mobile'
  
  const [pipelines, setPipelines] = useState(stubPipelines)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPipelines() {
      try {
        const contractorPipelines = await getContractorPipelines()
        if (contractorPipelines.length > 0) {
          setPipelines(contractorPipelines)
        }
      } catch (error) {
        console.warn('Failed to fetch pipelines, using stub data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPipelines()
  }, [])

  console.log('Selected Pipeline ID:', selectedPipelineId)
  console.log('Available Pipelines:', pipelines.map(p => p.id))
  
  const pipelineData = pipelines.find(p => p.id === selectedPipelineId) || pipelines[0]
  
  console.log('Pipeline Data:', pipelineData)

  if (loading) {
    return <div className="h-full flex items-center justify-center">Loading pipelines...</div>
  }

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground mb-4">Pipeline Management</h1>
        <PipelineSelector
          selectedPipeline={selectedPipelineId}
          pipelines={pipelines}
        />
      </div>
      <div className="flex-1 p-6">
        <KanbanBoard pipeline={pipelineData} />
      </div>
    </div>
  )
}
