import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Download, List, Loader2 } from 'lucide-react'
import { usePaginatedApi } from '@/hooks/useApi'
import { utilityApi } from '@/services/api'
import { format } from 'date-fns'

export default function BulkTrading() {
  const {
    data: logs,
    loading,
    meta,
    loadPage,
    refresh
  } = usePaginatedApi(
    (params) => utilityApi.getBulkTradingLogs(params),
    { limit: 50 }
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-800">Bulk trading logs</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refresh()}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-gray-200">
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
                    <TableHead>Done By</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log: any) => (
                    <TableRow key={log.id} className="hover:bg-gray-50">
                      <TableCell className="text-sm whitespace-nowrap">
                        {format(new Date(log.createdAt), 'dd-MM-yyyy HH:mm:ss')}
                      </TableCell>
                      <TableCell className="font-medium">
                        {log.user?.username || log.userId || 'System'}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">
                          {log.action}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="max-w-md truncate">
                          {JSON.stringify(log.newData || log.metadata)}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{log.ipAddress || '-'}</TableCell>
                    </TableRow>
                  ))}
                  {logs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                        No bulk trading logs found.
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