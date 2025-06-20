'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

const permitCodes = ['ROOF', 'RNVN', 'RNVS', 'NEWC', 'DEMO']
const statusOptions = ['Permit Issued', 'Finaled', 'Application Submitted', 'Under Review', 'Expired']
const radiusOptions = ['5', '10', '15', '25', '50']

interface FilterRibbonProps {
  searchParams: any
}

export function FilterRibbon({ searchParams }: FilterRibbonProps) {
  const router = useRouter()
  const params = useSearchParams()
  const pathname = usePathname()
  
  const [selectedCodes, setSelectedCodes] = useState<string[]>(
    searchParams?.codes ? searchParams.codes.split(',') : []
  )
  const [keyword, setKeyword] = useState(searchParams?.keyword || '')
  const [valueRange, setValueRange] = useState([
    parseInt(searchParams?.minValue) || 0,
    parseInt(searchParams?.maxValue) || 10000000
  ])
  const [radius, setRadius] = useState(searchParams?.radius || '25')
  const [status, setStatus] = useState(searchParams?.status || '')

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
    if (valueRange[1] < 10000000) {
      newParams.set('maxValue', valueRange[1].toString())
    }
    if (radius && radius !== '0') {
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

    router.push(`${pathname}?${newParams.toString()}`)
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
    setValueRange([0, 10000000])
    setRadius('25')
    setStatus('')
    router.push(pathname)
  }

  useEffect(() => {
    const timer = setTimeout(updateFilters, 500)
    return () => clearTimeout(timer)
  }, [selectedCodes, keyword, valueRange, radius, status])

  return (
    <div className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between gap-4 mb-3">
        {/* Search */}
        <Input
          placeholder="Search addresses, contractors, descriptions..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="max-w-md"
        />
        
        {/* Value Range */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Value:</span>
          <div className="w-48">
            <Slider
              value={valueRange}
              onValueChange={setValueRange}
              max={10000000}
              step={50000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>${valueRange[0].toLocaleString()}</span>
              <span>${valueRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Distance & Status */}
        <div className="flex items-center space-x-4">
          <Select value={radius} onValueChange={setRadius}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {radiusOptions.map(option => (
                <SelectItem key={option} value={option}>
                  {option}mi
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Status" />
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

        <Button variant="outline" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      {/* Permit Type Chips */}
      <div className="flex items-center space-x-2">
        {permitCodes.map(code => {
          const getColorStyle = (code: string) => {
            const isSelected = selectedCodes.includes(code)
            switch (code) {
              case 'ROOF': 
                return isSelected 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'border-blue-500 text-blue-700 hover:bg-blue-50'
              case 'RNVS':
              case 'NEWC': 
                return isSelected 
                  ? 'bg-red-500 text-white border-red-500' 
                  : 'border-red-500 text-red-700 hover:bg-red-50'
              case 'RNVN': 
                return isSelected 
                  ? 'bg-amber-500 text-white border-amber-500' 
                  : 'border-amber-500 text-amber-700 hover:bg-amber-50'
              case 'DEMO': 
                return isSelected 
                  ? 'bg-purple-500 text-white border-purple-500' 
                  : 'border-purple-500 text-purple-700 hover:bg-purple-50'
              default: 
                return isSelected 
                  ? 'bg-gray-500 text-white border-gray-500' 
                  : 'border-gray-500 text-gray-700 hover:bg-gray-50'
            }
          }
          
          return (
            <button
              key={code}
              className={`px-3 py-1 text-sm font-medium rounded-md border cursor-pointer transition-colors ${getColorStyle(code)}`}
              onClick={() => toggleCode(code)}
            >
              {code}
            </button>
          )
        })}
      </div>
    </div>
  )
}
