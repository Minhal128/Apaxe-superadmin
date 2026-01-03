import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Download, List, Search, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { usePaginatedApi } from '@/hooks/useApi'
import { utilityApi } from '@/services/api'
import { format } from 'date-fns'

export default function UserEditLog() {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    userId: '',
    editedBy: ''
  })

  const {
    data: logs,
    loading,
    meta,
    loadPage,
    refresh
  } = usePaginatedApi(
    (params) => utilityApi.getUserEditLog({
      ...params,
      ...filters,
      userId: filters.userId || undefined,
      editedBy: filters.editedBy || undefined
    }),
    { limit: 50 }
  )

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleReset = () => {
    setFilters({
      startDate: '',
      endDate: '',
      userId: '',
      editedBy: ''
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-800">User Edit logs</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by Target User ID"
              value={filters.userId}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0" onClick={() => refresh()}>
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">From</Label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-40"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">To</Label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-40"
            />
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Edited By</Label>
            <Input
              type="text"
              placeholder="Admin ID"
              value={filters.editedBy}
              onChange={(e) => handleFilterChange('editedBy', e.target.value)}
              className="w-40"
            />
          </div>

          <Button
            className="bg-green-500 hover:bg-green-600 text-white ml-2"
            onClick={() => refresh()}
          >
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Showing {logs.length} entries</span>
        </div>
        <div className="flex items-center gap-2">
          <List className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
          <Download className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <Card className="overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Time</TableHead>
                    <TableHead>Target User</TableHead>
                    <TableHead>Edited By</TableHead>
                    <TableHead className="min-w-[300px]">Changes</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log: any) => (
                    <TableRow key={log.id} className="hover:bg-gray-50">
                      <TableCell className="text-sm">
                        {format(new Date(log.createdAt), 'dd-MM-yyyy HH:mm:ss')}
                      </TableCell>
                      <TableCell className="font-medium">
                        {log.entityId || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {log.user?.username || log.userId || 'System'}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[400px]">
                          <div className="font-medium text-gray-900 text-sm mb-1">
                            {log.action}
                          </div>
                          <div className="text-xs text-gray-500 space-y-1 overflow-hidden">
                            {log.newData && Object.entries(log.newData).map(([field, newValue], idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className="font-medium shrink-0">{field}:</span>
                                {log.oldData?.[field] !== undefined && (
                                  <span className="text-red-600 line-through truncate max-w-[100px]">
                                    {JSON.stringify(log.oldData[field])}
                                  </span>
                                )}
                                <span className="shrink-0">→</span>
                                <span className="text-green-600 font-semibold truncate max-w-[150px]">
                                  {JSON.stringify(newValue)}
                                </span>
                              </div>
                            ))}
                            {!log.newData && log.metadata && (
                              <div className="text-xs italic truncate">
                                {JSON.stringify(log.metadata)}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {log.ipAddress || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {logs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                        No edit logs found matching your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Page {meta.page} of {meta.totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={meta.page === 1}
                onClick={() => loadPage(meta.page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={meta.page === meta.totalPages}
                onClick={() => loadPage(meta.page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}