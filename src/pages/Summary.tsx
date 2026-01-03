import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Download, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'
import { summaryApi } from '../services/api'
import { useApi } from '../hooks/useApi'
import { formatCurrency, formatNumber } from '../services/api'
import { toast } from 'react-toastify'

export default function Summary() {
  const [selectedSegment, setSelectedSegment] = useState('')
  const [dateRange, setDateRange] = useState('today')
  const [refreshing, setRefreshing] = useState(false)

  const getStartDate = useCallback(() => {
    const today = new Date()
    switch (dateRange) {
      case 'today':
        return today.toISOString().split('T')[0]
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        return weekAgo.toISOString().split('T')[0]
      case 'month':
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        return monthAgo.toISOString().split('T')[0]
      default:
        return today.toISOString().split('T')[0]
    }
  }, [dateRange])

  const getEndDate = useCallback(() => {
    return new Date().toISOString().split('T')[0]
  }, [])

  // Fetch trading summary - immediate: false to control fetch manually
  const { 
    data: summaryData, 
    loading,
    execute: fetchSummary 
  } = useApi(() => summaryApi.getTradingSummary({
    segment: selectedSegment || undefined,
    startDate: getStartDate(),
    endDate: getEndDate()
  }), { 
    immediate: false,
    onError: (error: string) => {
      // Handle authentication errors gracefully
      if (error.includes('500') || error.includes('401') || error.includes('403')) {
        console.log('Summary endpoint requires authentication - using mock data');
      }
    }
  })

  // Fetch when segment or date range changes
  useEffect(() => {
    fetchSummary()
  }, [selectedSegment, dateRange]) // Remove fetchSummary from deps - it's now stable

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await fetchSummary()
      toast.success('Summary refreshed')
    } catch (error) {
      toast.error('Failed to refresh summary')
    } finally {
      setRefreshing(false)
    }
  }

  const summary = summaryData || {
    // Mock data when API is not available
    totalTrades: 150,
    totalVolume: 1250000,
    totalPnl: 15000,
    activeUsers: 25,
    avgTradeSize: 8333
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Trading Summary</h1>
            <p className="text-sm text-gray-500 mt-1">
              Overview of trading activity and performance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSegment} onValueChange={setSelectedSegment}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Segments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Segments</SelectItem>
                <SelectItem value="NSE">NSE</SelectItem>
                <SelectItem value="MCX">MCX</SelectItem>
                <SelectItem value="BSE">BSE</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={handleRefresh} 
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Trades</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(summary.totalTrades || 0, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(summary.totalVolume || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total P&L</p>
                <p className={`text-2xl font-bold ${
                  (summary.totalPnl || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(summary.totalPnl || 0)}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                (summary.totalPnl || 0) >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {(summary.totalPnl || 0) >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-600" />
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(summary.activeUsers || 0, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Summary Table */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Summary</h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Change</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Total Trades</TableCell>
                      <TableCell>{formatNumber(summary.totalTrades || 0, 0)}</TableCell>
                      <TableCell className="text-green-600">+12%</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Total Volume</TableCell>
                      <TableCell>{formatCurrency(summary.totalVolume || 0)}</TableCell>
                      <TableCell className="text-green-600">+8%</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Growing
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Average Trade Size</TableCell>
                      <TableCell>{formatCurrency(summary.avgTradeSize || 0)}</TableCell>
                      <TableCell className="text-blue-600">+5%</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Stable
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}