import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Download, List, Loader2 } from 'lucide-react'
import { reportsApi } from '@/services/api'
import { useApi } from '@/hooks/useApi'

export default function ProfitLoss() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [expandedRows, setExpandedRows] = useState<number[]>([])
  const { data: apiResponse, loading } = useApi(reportsApi.getPnLReport, { immediate: true })

  const toggleRow = (index: number) => {
    setExpandedRows(prev =>
      prev.includes(index) ? prev.filter(item => item !== index) : [...prev, index]
    )
  }

  // Extract the actual data array from the API response
  const pnlData = Array.isArray(apiResponse) ? apiResponse : (apiResponse?.data || [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-800">Profit loss percentage</h1>
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Valan</span>
            <div className="flex items-center gap-1">
              <Input
                type="text"
                placeholder="Search"
                className="w-48"
              />
              <Button variant="outline" size="sm" className="h-10">
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            Search
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
          <ChevronDown className={`w-4 h-4 transform transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
        </Button>

        {/* Collapsible Filters for Mobile */}
        {isFiltersOpen && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap min-w-12">Valan</span>
              <div className="flex-1 flex items-center gap-1">
                <Input
                  type="text"
                  placeholder="Search"
                  className="flex-1"
                />
                <Button variant="outline" size="sm" className="h-10">
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button className="bg-green-500 hover:bg-green-600 text-white w-full">
              Search
            </Button>
          </div>
        )}
      </div>

      {/* Show All entries */}
      <div className="bg-white px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">P&L Report</span>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </div>
        <div className="flex items-center gap-2">
          <List className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
          <Download className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <Card className="overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">User</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Percentage profit</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Margin used</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Net PNL</th>
                </tr>
              </thead>
              <tbody>
                {(pnlData || []).map((item: any, index: number) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">{item.user || '-'}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{item.percentageProfit || '-'}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{item.marginUsed || '-'}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{item.netPNL || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {(pnlData || []).map((item: any, index: number) => (
              <Card key={index} className="m-4 overflow-hidden">
                {/* Header - Always Visible */}
                <div
                  className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleRow(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{item.user || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">User ID</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium px-2 py-1 rounded ${item.netPNL && parseFloat(String(item.netPNL).split('.')[0]) >= 0
                        ? 'text-green-600 bg-green-50'
                        : 'text-red-600 bg-red-50'
                        }`}>
                        {item.netPNL ? String(item.netPNL).split('.')[0] : '0'}
                      </span>
                      {expandedRows.includes(index) ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expandable Content */}
                {expandedRows.includes(index) && (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">Percentage Profit:</span>
                        <p className="text-gray-900 font-semibold">{item.percentageProfit || '0%'}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">Margin Used:</span>
                        <p className="text-gray-900 font-semibold">{item.marginUsed || '0'}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">Net PNL:</span>
                        <p className={`text-lg font-bold ${item.netPNL && parseFloat(String(item.netPNL).split('.')[0]) >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                          }`}>
                          {item.netPNL || '0'}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        Export
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {(!pnlData || pnlData.length === 0) && (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">No profit/loss data available</div>
              <div className="text-sm text-gray-500">Try adjusting your search filters</div>
            </div>
          )}
        </Card>

        {/* Pagination - Mobile Friendly */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Showing {pnlData?.length || 0} entries
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled className="text-xs">
              Previous
            </Button>
            <Button variant="outline" size="sm" className="text-xs bg-gray-100">
              1
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              2
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}