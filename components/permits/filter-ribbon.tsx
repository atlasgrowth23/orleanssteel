'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

const permitCodes = ['ROOF', 'FENC', 'RNVN', 'MBLD']
const statusOptions = ['New', 'Queued', 'Contacted', 'Follow-Up', 'Done']
const radiusOptions = ['25', '50', '100', 'Any']

interface FilterRibbonProps {
  searchParams: any
}

export function FilterRibbon({ searchParams }: FilterRibbonProps) {
  const router = useRouter()
  const params = useSearchParams()
  
  const [selectedCodes, setSelectedCodes] = useState<string[]>(
    searchParams.codes ? searchParams.codes.split(',') : []
  )
  const [keyword, setKeyword] = useState(searchParams.keyword || '')
  const [valueRange, setValueRange] = useState([
    parseInt(searchParams.minValue) || 0,
    parseInt(searchParams.maxValue) || 500000
  ])
  const [radius, setRadius] = useState(searchParams.radius || 'Any')
  const [status, setStatus] = useState(searchParams.status || '')

  const updateFilters = () => {
    const newParams = new URLSearchParams()
    
    if (selectedCodes.length > 0) {
      newParams.set('codes', selectedCodes.join(','))
    }
    if (keyword) {
      newParams.set('keyword', keyword)
    }
    if (valueRange[0] > 0) {
      newParams.set('minValue', valueRange[0].toString())
    }
    if (valueRange[1] < 500000) {
      newParams.set('maxValue', valueRange[1].toString())
    }
    if (radius !== 'Any') {
      newParams.set('radius', radius)
    }
    if (status && status !== 'all') {
      newParams.set('status', status)
    }

    // Preserve existing date range params
    if (searchParams.startDate) {
      newParams.set('startDate', searchParams.startDate)
    }
    if (searchParams.endDate) {
      newParams.set('endDate', searchParams.endDate)
    }

    router.push(`/permits?${newParams.toString()}`)
  }

  const toggleCode = (code: string) => {
    setSelectedCodes(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    )
  }

  const clearFilters = () => {
    setSelectedCodes([])
    setKeyword('')
    setValueRange([0, 500000])
    setRadius('Any')
    setStatus('')
    router.push('/permits')
  }

  useEffect(() => {
    const timer = setTimeout(updateFilters, 500)
    return () => clearTimeout(timer)
  }, [selectedCodes, keyword, valueRange, radius, status])

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Code Chips */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Codes:</span>
          {permitCodes.map(code => (
            <Badge
              key={code}
              variant={selectedCodes.includes(code) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleCode(code)}
            >
              {code}
            </Badge>
          ))}
        </div>

        {/* Keyword Search */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Keyword:</span>
          <Input
            placeholder="Search addresses..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-48"
          />
        </div>

        {/* Valuation Slider */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Value:</span>
          <div className="w-48 px-3">
            <Slider
              value={valueRange}
              onValueChange={setValueRange}
              max={500000}
              step={5000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>${valueRange[0].toLocaleString()}</span>
              <span>${valueRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Radius Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Radius:</span>
          <Select value={radius} onValueChange={setRadius}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {radiusOptions.map(option => (
                <SelectItem key={option} value={option}>
                  {option === 'Any' ? 'Any' : `${option}mi`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {statusOptions.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="ml-auto"
        >
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>
    </div>
  )
}
