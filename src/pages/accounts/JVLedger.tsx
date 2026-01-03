import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { ledgerApi, formatDate, formatCurrency } from '@/services/api'
import { usePaginatedApi } from '@/hooks/useApi'
import { Loader2 } from 'lucide-react'

export default function JVLedger() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [filters, setFilters] = useState({ userId: '', startDate: '', endDate: '' })

  const { data: jvLedgerData, loading, updateFilters } = usePaginatedApi(
    ledgerApi.getJournalLedger,
    { limit: 50 }
  )

  const handleSubmit = () => {
    updateFilters(filters)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-800">JV Ledger</h1>
        <div className="w-full sm:w-64">
          <Input
            type="text"
            placeholder="Search"
            className="w-full"
          />
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden sm:block bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="User ID"
              className="w-full"
              value={filters.userId}
              onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
            />
          </div>
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

      {/* Mobile Filters Toggle */}
      <div className="sm:hidden bg-white border-b border-gray-200 px-4 py-3">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        >
          <span>Filters</span>
          <svg
            className={`w-4 h-4 transform transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>

        {/* Collapsible Filters for Mobile */}
        {isFiltersOpen && (
          <div className="mt-4 space-y-3">
            <Input
              type="text"
              placeholder="User ID"
              className="w-full"
              value={filters.userId}
              onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
            />
            <Input
              type="date"
              placeholder="Start Date"
              className="w-full"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
            <Input
              type="date"
              placeholder="End Date"
              className="w-full"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
            <Button className="bg-green-500 hover:bg-green-600 text-white w-full" onClick={handleSubmit} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
            </Button>
          </div>
        )}
      </div>

      {/* Show All entries */}
      <div className="bg-white px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show All entries</span>
          <Button variant="outline" size="sm" className="h-6 w-6 p-0">
            <span className="text-xs">+</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <svg className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <Card className="overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">From Account</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">To Account</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Remark</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Time</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">IP</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Edit Time</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Add Time</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {(jvLedgerData || []).map((item: any, index: number) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">{item.user?.firstName || item.userId || '-'}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{item.sourceUserId || '-'}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{formatCurrency(item.amount)}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{item.description || item.reference || '-'}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{formatDate(item.createdAt)}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{formatDate(item.createdAt)}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">-</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{formatDate(item.updatedAt)}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{formatDate(item.createdAt)}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm">
                      <div className="flex gap-1 sm:gap-2 flex-wrap">
                        {['View'].map((btn) => (
                          <Button key={btn} variant="outline" size="sm" className="h-6 sm:h-7 px-2 text-xs">
                            {btn}
                          </Button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4 p-4">
            {(jvLedgerData || []).map((item: any, index: number) => (
              <Card key={index} className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="col-span-2">
                    <span className="font-medium text-gray-500">Transfer:</span>
                    <p className="text-gray-900 font-medium">{item.user?.firstName || item.userId} → {item.sourceUserId || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Amount:</span>
                    <p className="text-gray-900 font-semibold">{formatCurrency(item.amount)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Date:</span>
                    <p className="text-gray-900">{formatDate(item.createdAt)}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-gray-500">Remark:</span>
                    <p className="text-gray-900">{item.description || item.reference || '-'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Time:</span>
                    <p className="text-gray-900 text-xs">{formatDate(item.createdAt)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Type:</span>
                    <p className="text-gray-900 text-xs">{item.type || 'TRANSFER'}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex gap-1 flex-wrap">
                    {['View'].map((btn) => (
                      <Button key={btn} variant="outline" size="sm" className="h-6 px-2 text-xs">
                        {btn}
                      </Button>
                    ))}
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