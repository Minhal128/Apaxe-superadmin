import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { ledgerApi, formatDate, formatCurrency } from '@/services/api'
import { usePaginatedApi } from '@/hooks/useApi'
import { Loader2 } from 'lucide-react'

export default function DepositLedger() {
  const [filters, setFilters] = useState({ userId: '', startDate: '', endDate: '' })

  const { data: depositLedgerData, loading, updateFilters } = usePaginatedApi(
    ledgerApi.getDepositLedger,
    { limit: 50 }
  )

  const handleSubmit = () => {
    updateFilters(filters)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Deposit Ledger</h1>
          <Input
            type="text"
            placeholder="Search User ID"
            className="w-full sm:w-64 h-10"
            value={filters.userId}
            onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Input
            type="date"
            className="w-full sm:w-48 h-10"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
          <Input
            type="date"
            className="w-full sm:w-48 h-10"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
          <Button className="bg-green-500 hover:bg-green-600 text-white h-10 w-full sm:w-auto" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </Button>
        </div>
      </div>

      {/* Show All entries */}
      <div className="bg-white px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-600">Deposit Entries</span>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <Card className="overflow-hidden">
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3 p-4">
            {(depositLedgerData || []).map((item: any, index: number) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500">Client:</span>
                      <p className="text-sm font-medium text-gray-900">{item.user?.firstName || item.userId || '-'}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">Amount:</span>
                      <p className="text-sm font-semibold text-green-600">{formatCurrency(item.amount)}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">Balance:</span>
                      <p className="text-sm text-gray-900">{formatCurrency(item.balanceBefore)} → {formatCurrency(item.balanceAfter)}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">Time:</span>
                      <p className="text-sm text-gray-900">{formatDate(item.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Client</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Amount</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Balance Before</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Balance After</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Description</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Time</th>
                </tr>
              </thead>
              <tbody>
                {(depositLedgerData || []).map((item: any, index: number) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900">{item.user?.firstName || item.userId || '-'}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-green-600">{formatCurrency(item.amount)}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{formatCurrency(item.balanceBefore)}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{formatCurrency(item.balanceAfter)}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{item.description || item.reference || '-'}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{formatDate(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}