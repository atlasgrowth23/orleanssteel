'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface PipelineSelectorProps {
  selectedPipeline: string
  pipelines: Array<{ id: string; name: string }>
}

export function PipelineSelector({ selectedPipeline, pipelines }: PipelineSelectorProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handlePipelineChange = (pipelineId: string) => {
    router.push(`${pathname}?pipeline=${pipelineId}`)
  }

  return (
    <div className="flex items-center space-x-4">
      <label className="text-sm font-medium text-gray-700">Pipeline:</label>
      <Select value={selectedPipeline} onValueChange={handlePipelineChange}>
        <SelectTrigger className="w-64">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {pipelines.map(pipeline => (
            <SelectItem key={pipeline.id} value={pipeline.id}>
              {pipeline.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
