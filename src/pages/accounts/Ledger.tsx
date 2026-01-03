import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { ledgerApi, formatCurrency } from '@/services/api'
import { useApi } from '@/hooks/useApi'
import { Loader2 } from 'lucide-react'

export default function Ledger() {
  const [userId, setUserId] = useState('')
  const { data: ledgerResponse, loading, execute } = useApi(ledgerApi.getCashLedger)

  const handleSearch = () => {
    execute({ userId, limit: 100 })
  }

  // Extract ledger data and calculate current balances
  const ledgerData = ledgerResponse || []

  // Group by user and get latest balance
  const balanceMap = new Map()
  ledgerData.forEach((entry: any) => {
    const userId = entry.userId
    if (!balanceMap.has(userId) || new Date(entry.createdAt) > new Date(balanceMap.get(userId).createdAt)) {
      balanceMap.set(userId, entry)
    }
  })

  const balances = Array.from(balanceMap.values())

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Ledger Balances</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Search by User ID"
              className="w-full sm:w-64 h-10"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <Button onClick={handleSearch} disabled={loading} className="h-10">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button className="bg-green-500 hover:bg-green-600 text-white h-10 w-full sm:w-auto" onClick={handleSearch} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Refresh
          </Button>
          <Button variant="outline" className="h-10 w-full sm:w-auto" onClick={() => setUserId('')}>
            Reset
          </Button>
        </div>
      </div>

      {/* Show All entries */}
      <div className="bg-white px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-600">Current Balances</span>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <Card className="overflow-hidden">
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3 p-4">
            {balances.map((item: any, index: number) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500">User:</span>
                      <p className="text-sm font-medium text-gray-900">{item.user?.firstName || item.userId || '-'}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">Current Balance:</span>
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.balanceAfter)}</p>
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
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">User</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Current Balance</th>
                </tr>
              </thead>
              <tbody>
                {balances.map((item: any, index: number) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900">{item.user?.firstName || item.userId || '-'}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{item.user?.email || '-'}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-900">{formatCurrency(item.balanceAfter)}</td>
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