import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { ledgerApi, formatDate, formatCurrency } from '@/services/api'
import { usePaginatedApi } from '@/hooks/useApi'
import { Loader2 } from 'lucide-react'

export default function CashLedger() {
  const [filters, setFilters] = useState({ userId: '', startDate: '', endDate: '' })

  const { data: cashLedgerData, loading, updateFilters } = usePaginatedApi(
    ledgerApi.getCashLedger,
    { limit: 50 }
  )

  const handleSubmit = () => {
    updateFilters(filters)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-800">Cash Ledger</h1>
        <div className="w-full sm:w-64">
          <Input
            type="text"
            placeholder="Search User ID"
            className="w-full"
            value={filters.userId}
            onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-48">
            <Input
              type="date"
              placeholder="Start Date"
              className="w-full"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>
          <div className="w-full sm:w-48">
            <Input
              type="date"
              placeholder="End Date"
              className="w-full"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>
          <Button className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto" onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
          </Button>
        </div>
      </div>

      {/* Show All entries */}
      <div className="bg-white px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Cash Ledger Entries</span>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <Card className="overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Client</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Balance Before</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Balance After</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Time</th>
                </tr>
              </thead>
              <tbody>
                {(cashLedgerData || []).map((item: any, index: number) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">{item.user?.firstName || item.userId || '-'}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${item.type === 'CREDIT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{formatCurrency(item.amount)}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{formatCurrency(item.balanceBefore)}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{formatCurrency(item.balanceAfter)}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{item.description || item.reference || '-'}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{item.category}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{formatDate(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4 p-4">
            {(cashLedgerData || []).map((item: any, index: number) => (
              <Card key={index} className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Client:</span>
                    <p className="text-gray-900">{item.user?.firstName || item.userId || '-'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Type:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${item.type === 'CREDIT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.type}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Amount:</span>
                    <p className="text-gray-900 font-semibold">{formatCurrency(item.amount)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Time:</span>
                    <p className="text-gray-900 text-xs">{formatDate(item.createdAt)}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-gray-500">Balance:</span>
                    <p className="text-gray-900">{formatCurrency(item.balanceBefore)} → {formatCurrency(item.balanceAfter)}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-gray-500">Description:</span>
                    <p className="text-gray-900">{item.description || item.reference || '-'}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}