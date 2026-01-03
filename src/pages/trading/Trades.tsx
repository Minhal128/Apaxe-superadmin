import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Download, List, Grid3x3, Pencil, Trash2, Search, Filter, ChevronDown, ChevronUp, RefreshCw, Loader2 } from 'lucide-react'
import { tradingApi, userApi } from '../../services/api'

// Available segments for filtering
const SEGMENTS = [
  { id: 'NSE', name: 'NSE' },
  { id: 'BSE', name: 'BSE' },
  { id: 'NFO', name: 'NFO' },
  { id: 'MCX', name: 'MCX' },
  { id: 'CDS', name: 'CDS' },
]
import { useApi } from '../../hooks/useApi'
import { toast } from 'react-toastify'

interface Trade {
  id: string
  tradeNumber: string
  userId: string
  username: string
  instrumentId: string
  symbol: string
  segment: string
  side: string
  quantity: number
  price: number
  value: number
  commission: number
  pnl: number
  executedAt: string
  status: string
  ip?: string
}

export default function Trades() {
  const [showAllEntries, setShowAllEntries] = useState(false)
  const [selectedTab, setSelectedTab] = useState('trades')
  const [isMobile, setIsMobile] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [expandedTrade, setExpandedTrade] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    userId: '',
    segmentId: '',
    instrumentId: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 50
  })

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // API calls
  const {
    data: tradesResponse,
    loading: tradesLoading,
    execute: fetchTrades
  } = useApi(tradingApi.getAllTrades, {
    immediate: false,
    onError: () => {
      // Silently handle errors - use fallback data
    }
  })

  const { data: usersResponse } = useApi(userApi.getUsers, {
    immediate: true,
    onError: () => {
      // Silently handle errors
    }
  })

  // Fetch trades data
  const loadTradesData = useCallback(() => {
    const params: Record<string, any> = {
      page: filters.page,
      limit: filters.limit
    }
    if (filters.userId) params.userId = filters.userId
    if (filters.segmentId) params.segmentId = filters.segmentId
    if (filters.instrumentId) params.instrumentId = filters.instrumentId
    if (filters.startDate) params.startDate = filters.startDate
    if (filters.endDate) params.endDate = filters.endDate
    fetchTrades(params)
  }, [fetchTrades, filters])

  useEffect(() => {
    loadTradesData()
  }, [loadTradesData])

  // Auto-refresh every 5 seconds for real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      loadTradesData()
    }, 5000)
    return () => clearInterval(interval)
  }, [loadTradesData])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handleExport = () => {
    toast.info('Export functionality coming soon')
  }

  // Process trades data from API response
  const segments = SEGMENTS
  const users = Array.isArray(usersResponse?.data) ? usersResponse.data : []
  const instruments: any[] = [] // Instruments loaded dynamically based on segment
  const rawTradesData = tradesResponse?.data?.trades || tradesResponse?.data || []
  const pagination = tradesResponse?.data?.pagination || { page: 1, totalPages: 1, total: 0 }

  // Transform trades data for display
  const tradesData: Trade[] = Array.isArray(rawTradesData) ? rawTradesData.map((trade: any) => ({
    id: trade.id || trade._id,
    tradeNumber: trade.tradeNumber || `T${trade.id?.slice(-6) || '000000'}`,
    userId: trade.userId,
    username: trade.user?.username || trade.username || 'N/A',
    instrumentId: trade.instrumentId,
    symbol: trade.instrument?.symbol || trade.symbol || 'N/A',
    segment: trade.instrument?.segment?.name || trade.segment || 'N/A',
    side: trade.side,
    quantity: trade.quantity,
    price: trade.price,
    value: trade.value,
    commission: trade.commission || 0,
    pnl: trade.pnl || 0,
    executedAt: trade.executedAt || trade.createdAt,
    status: trade.status || 'Executed',
    ip: trade.ip || 'N/A'
  })) : []

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const formatTime = (dateStr: string) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const MobileTradeCard = ({ trade }: { trade: Trade }) => (
    <Card key={trade.id} className="p-4 mb-4">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="trade"
              className="rounded-full w-4 h-4"
            />
            <div>
              <div className="font-medium text-sm">{trade.username}</div>
              <div className="text-xs text-gray-500">{formatDate(trade.executedAt)} • {formatTime(trade.executedAt)}</div>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
            {trade.status}
          </Badge>
        </div>

        {/* Trade Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500 text-xs">Trade #</span>
            <div className="font-medium">{trade.tradeNumber}</div>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Segment</span>
            <div className="font-medium">{trade.segment}</div>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Symbol</span>
            <div className="font-medium">{trade.symbol}</div>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Side</span>
            <Badge className={`text-xs ${trade.side === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {trade.side}
            </Badge>
          </div>
        </div>

        {/* Expandable Details */}
        {expandedTrade === trade.id && (
          <div className="border-t pt-3 space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-gray-500 text-xs">Quantity</span>
                <div className="font-medium">{trade.quantity}</div>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Price</span>
                <div className="font-medium">₹{formatCurrency(trade.price)}</div>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Value</span>
                <div className="font-medium">₹{formatCurrency(trade.value)}</div>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Commission</span>
                <div className="font-medium">₹{formatCurrency(trade.commission)}</div>
              </div>
              <div>
                <span className="text-gray-500 text-xs">P&L</span>
                <div className={`font-medium ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{formatCurrency(trade.pnl)}
                </div>
              </div>
              <div>
                <span className="text-gray-500 text-xs">IP Address</span>
                <div className="font-medium">{trade.ip}</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm"
              onClick={() => setExpandedTrade(expandedTrade === trade.id ? null : trade.id)}
            >
              {expandedTrade === trade.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Details
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-gray-700">
              <Pencil className="w-4 h-4" />
            </button>
            <button className="text-gray-400 hover:text-red-600">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-800">Trades</h1>
            {tradesLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-500" />}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-80 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search trades..."
                className="pl-9 h-10"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden h-10 w-10"
            >
              <Filter className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10" onClick={loadTradesData}>
              <RefreshCw className={`w-4 h-4 ${tradesLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" size="icon" className="hidden md:flex h-10 w-10">
              <Grid3x3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tab and Filters */}
      <div className={`bg-white border-b border-gray-200 px-4 md:px-6 py-4 ${isMobile && !showFilters ? 'hidden md:block' : 'block'}`}>
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-4 flex-wrap mb-4">
          <Select value={selectedTab} onValueChange={setSelectedTab}>
            <SelectTrigger className="w-full md:w-32">
              <SelectValue placeholder="Trades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="orders">Orders</SelectItem>
              <SelectItem value="trades">Trades</SelectItem>
            </SelectContent>
          </Select>

          <div className="grid grid-cols-1 md:flex md:items-center gap-4 md:gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">From</span>
              <div className="relative flex-1">
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full md:w-40"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">To</span>
              <div className="relative flex-1">
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full md:w-40"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:flex md:items-center gap-4 md:gap-2">
            <Select value={filters.segmentId || 'all'} onValueChange={(v) => handleFilterChange('segmentId', v === 'all' ? '' : v)}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Market" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Markets</SelectItem>
                {segments.map((seg: any) => (
                  <SelectItem key={seg.id} value={seg.id}>{seg.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.instrumentId || 'all'} onValueChange={(v) => handleFilterChange('instrumentId', v === 'all' ? '' : v)}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Script" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scripts</SelectItem>
                {instruments.slice(0, 50).map((inst: any) => (
                  <SelectItem key={inst.id} value={inst.id}>{inst.symbol}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.userId || 'all'} onValueChange={(v) => handleFilterChange('userId', v === 'all' ? '' : v)}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {users.map((user: any) => (
                  <SelectItem key={user.id} value={user.id}>{user.username}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showAllEntries}
              onChange={(e) => setShowAllEntries(e.target.checked)}
              className="rounded border-gray-300"
            />
            Show All entries
          </label>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        <Card className="overflow-hidden">
          <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-2">
              <List className="w-4 h-4 text-gray-500" />
              <Download className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" onClick={handleExport} />
            </div>
            <div className="text-sm text-gray-600">
              {tradesData.length} of {pagination.total || tradesData.length} trades
            </div>
          </div>

          {isMobile ? (
            // Mobile View
            <div className="p-4">
              {tradesLoading && tradesData.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                  <span className="ml-2 text-gray-500">Loading trades...</span>
                </div>
              ) : tradesData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No trades found</div>
              ) : (
                tradesData.map((trade) => (
                  <MobileTradeCard key={trade.id} trade={trade} />
                ))
              )}
            </div>
          ) : (
            // Desktop View
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 min-w-[50px]">D ▼</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[100px]">Trade #</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[80px]">Time</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[100px]">Date</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[120px]">User</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[100px]">Segment</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[150px]">Symbol</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[60px]">Side</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[60px]">QTY</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[120px]">Price</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[120px]">Value</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[100px]">P&L</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[100px]">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tradesLoading && tradesData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={14} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                          <span className="ml-2 text-gray-500">Loading trades...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : tradesData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={14} className="text-center py-8 text-gray-500">
                        No trades found
                      </TableCell>
                    </TableRow>
                  ) : (
                    tradesData.map((row) => (
                      <TableRow key={row.id} className="hover:bg-gray-50">
                        <TableCell>
                          <input type="radio" name="trade" className="rounded-full" />
                        </TableCell>
                        <TableCell className="font-medium">{row.tradeNumber}</TableCell>
                        <TableCell>{formatTime(row.executedAt)}</TableCell>
                        <TableCell>{formatDate(row.executedAt)}</TableCell>
                        <TableCell>{row.username}</TableCell>
                        <TableCell>{row.segment}</TableCell>
                        <TableCell>{row.symbol}</TableCell>
                        <TableCell>
                          <Badge className={row.side === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                            {row.side}
                          </Badge>
                        </TableCell>
                        <TableCell>{row.quantity}</TableCell>
                        <TableCell>₹{formatCurrency(row.price)}</TableCell>
                        <TableCell>₹{formatCurrency(row.value)}</TableCell>
                        <TableCell className={row.pnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                          ₹{formatCurrency(row.pnl)}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-700">{row.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Pencil className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-700" />
                            <Trash2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-600" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
