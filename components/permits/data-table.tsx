'use client'

import { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import { Permit } from '@/types'

const columnHelper = createColumnHelper<Permit>()

const columns = [
  columnHelper.accessor('issuedate', {
    header: 'Issue Date',
    cell: info => {
      const date = info.getValue()
      return date ? format(new Date(date), 'MMM dd, yyyy') : 'N/A'
    },
  }),
  columnHelper.accessor('distance', {
    header: 'Distance',
    cell: info => {
      const distance = info.getValue()
      return distance ? `${distance}mi` : 'N/A'
    },
  }),
  columnHelper.accessor('address', {
    header: 'Address',
    cell: info => (
      <div className="max-w-xs truncate" title={info.getValue()}>
        {info.getValue()}
      </div>
    ),
  }),
  columnHelper.accessor('code', {
    header: 'Type',
    cell: info => {
      const code = info.getValue()
      const permit = info.row.original
      const category = permit.steelCategory
      
      // Get the exact color from ORLEANS_STEEL_RELEVANT_CODES
      const getColorForCategory = (category: string) => {
        switch (category) {
          case 'Fencing & Gates': return '#22c55e'
          case 'Metal Roofing': return '#3b82f6'
          case 'Structural Steel': return '#ef4444'
          case 'General Construction': return '#f59e0b'
          case 'Opportunity': return '#a855f7'
          default: return '#6b7280'
        }
      }
      
      const dotColor = getColorForCategory(category)
      
      return (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: dotColor }}
            ></div>
            <span className="text-sm font-mono">
              {code}
            </span>
          </div>
          {permit.isSteelRelevant && (
            <div className="text-xs text-muted-foreground">
              {category}
            </div>
          )}
        </div>
      )
    },
  }),
  columnHelper.accessor('value', {
    header: 'Value',
    cell: info => {
      const value = info.getValue()
      return value ? `$${value.toLocaleString()}` : 'N/A'
    },
  }),
  columnHelper.accessor('contractor', {
    header: 'Contractor',
    cell: info => {
      const contractor = info.getValue() || '-'
      const truncated = contractor.length > 20 ? contractor.substring(0, 20) + '...' : contractor
      return (
        <div className="max-w-[150px]">
          <div className="text-sm" title={contractor}>
            {truncated}
          </div>
        </div>
      )
    },
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: info => {
      const description = info.getValue() || ''
      const truncated = description.length > 50 ? description.substring(0, 50) + '...' : description
      return (
        <div className="max-w-[200px]">
          <div className="text-sm" title={description}>
            {truncated || 'N/A'}
          </div>
        </div>
      )
    },
  }),
]

interface DataTableProps {
  data: Permit[]
}

export function DataTable({ data }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'issuedate', desc: true }
  ])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  return (
    <>
      <div className="bg-white rounded-lg border">
        <div className="overflow-auto max-h-[calc(100vh-200px)]">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center space-x-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' ↑',
                          desc: ' ↓',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50"
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
