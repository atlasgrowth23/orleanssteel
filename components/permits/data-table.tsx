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
import { PermitDrawer } from './permit-drawer'
import { Permit } from '@/types'

const columnHelper = createColumnHelper<Permit>()

const columns = [
  columnHelper.accessor('issuedate', {
    header: 'Issued Date',
    cell: info => format(new Date(info.getValue()), 'MMM dd, yyyy'),
    sortingFn: 'datetime',
  }),
  columnHelper.accessor('code', {
    header: 'Code',
    cell: info => (
      <span className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('value', {
    header: 'Value',
    cell: info => {
      const value = info.getValue()
      return value ? `$${value.toLocaleString()}` : 'N/A'
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
  columnHelper.display({
    id: 'score',
    header: 'Score',
    cell: () => (
      <div className="w-16 h-2 bg-gray-200 rounded">
        <div className="w-3/4 h-full bg-primary rounded"></div>
      </div>
    ),
  }),
]

interface DataTableProps {
  data: Permit[]
}

export function DataTable({ data }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'issuedate', desc: true }
  ])
  const [selectedPermit, setSelectedPermit] = useState<Permit | null>(null)

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
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedPermit(row.original)}
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

      <PermitDrawer
        permit={selectedPermit}
        open={!!selectedPermit}
        onClose={() => setSelectedPermit(null)}
      />
    </>
  )
}
