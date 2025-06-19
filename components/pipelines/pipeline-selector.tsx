'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const pipelineOptions = [
  { id: 'fence-mobile', label: 'Fence – Mobile' },
  { id: 'fence-no-mobile', label: 'Fence – No Mobile' },
  { id: 'gc-mobile', label: 'GC – Mobile' },
  { id: 'gc-no-mobile', label: 'GC – No Mobile' },
]

interface PipelineSelectorProps {
  selectedPipeline: string
  onPipelineChange: (pipeline: string) => void
}

export function PipelineSelector({ selectedPipeline, onPipelineChange }: PipelineSelectorProps) {
  return (
    <div className="flex items-center space-x-4">
      <label className="text-sm font-medium text-gray-700">Pipeline:</label>
      <Select value={selectedPipeline} onValueChange={onPipelineChange}>
        <SelectTrigger className="w-64">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {pipelineOptions.map(option => (
            <SelectItem key={option.id} value={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
