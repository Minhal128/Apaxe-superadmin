import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Calendar, Download, List, Pencil, Menu, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { forexApi } from '../../services/api'
import { useApi } from '../../hooks/useApi'
import { toast } from 'react-toastify'

export default function ForexTrade() {
  const [isMobile, setIsMobile] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    userId: '',
    currencyPair: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 50
  })

  // API call for forex trades data
  const { 
    data: tradesResponse, 
    loading: tradesLoading, 
    execute: fetchTrades 
  } = useApi(forexApi.getForexTrades, { 
    immediate: false,
    onError: (error: string) => {
      // Handle authentication errors gracefully
      if (error.includes('401') || error.includes('403') || error.includes('500')) {
        console.log('Forex trades endpoint requires authentication');
      }
    }
  })

  // Check screen size on component mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Fetch trades when component mounts or filters change
  useEffect(() => {
    fetchTrades(filters)
  }, [fetchTrades, filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }))
  }

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }))
  }

  const handleExport = async () => {
    try {
      toast.info('Export functionality coming soon')
    } catch (error) {
      toast.error('Failed to export data')
    }
  }

  // Get trades data from API response
  const trades = tradesResponse?.data?.trades || []
  const pagination = tradesResponse?.data?.pagination || { page: 1, totalPages: 1, total: 0 }

  // Mobile trade card component
  const MobileTradeCard = ({ trade, index }: { trade: any, index: number }) => (
    <Card key={index} className="p-4 mb-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input type="radio" name="trade" className="w-4 h-4" />
            <span className="font-medium text-sm">
              {trade.user?.firstName} {trade.user?.lastName}
            </span>
          </div>
          <span className={`px-2 py-1 rounded text-xs ${
            trade.status === 'FILLED' ? 'bg-green-100 text-green-800' : 
            trade.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
            trade.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {trade.status}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Currency Pair:</span>
            <span className="ml-2 font-medium">{trade.instrument?.symbol}</span>
          </div>
          <div>
            <span className="text-gray-500">Side:</span>
            <span className="ml-2 font-medium">{trade.side}</span>
          </div>
          <div>
            <span className="text-gray-500">Date:</span>
            <span className="ml-2 font-medium">{new Date(trade.createdAt).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-500">Time:</span>
            <span className="ml-2 font-medium">{new Date(trade.createdAt).toLocaleTimeString()}</span>
          </div>
          <div>
            <span className="text-gray-500">Quantity:</span>
            <span className="ml-2 font-medium">{trade.quantity}</span>
          </div>
          <div>
            <span className="text-gray-500">Price:</span>
            <span className="ml-2 font-medium">{trade.price?.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-500">Value:</span>
            <span className="ml-2 font-medium">₹{trade.value?.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-500">P&L:</span>
            <span className={`ml-2 font-medium ${
              (trade.pnl || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ₹{trade.pnl?.toLocaleString() || '0'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
              <Pencil className="w-4 h-4" />
              <span className="text-sm">View</span>
            </button>
            <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
              <List className="w-4 h-4" />
              <span className="text-sm">Details</span>
            </button>
          </div>
          <span className="text-xs text-gray-500">
            Commission: ₹{trade.commission?.toLocaleString() || '0'}
          </span>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <h1 className="text-xl font-semibold text-gray-800">Forex Trades</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search trades..."
                className="pl-9 h-10"
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="hidden md:flex h-10 w-10" onClick={handleExport}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`bg-white border-b border-gray-200 px-4 md:px-6 py-4 ${isMobile && !showFilters ? 'hidden' : 'block'}`}>
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Select value="trades" onValueChange={() => {}}>
              <SelectTrigger className="w-full md:w-32 bg-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trades">Trades</SelectItem>
                <SelectItem value="positions">Positions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:flex md:items-center gap-4 md:gap-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 whitespace-nowrap">Trade after</Label>
              <div className="relative flex-1">
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full md:w-32 pr-8"
                />
                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 whitespace-nowrap">Trade before</Label>
              <div className="relative flex-1">
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full md:w-32 pr-8"
                />
                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:flex md:items-center gap-4 md:gap-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 whitespace-nowrap">Currency Pair</Label>
              <Select value={filters.currencyPair || 'all'} onValueChange={(value) => handleFilterChange('currencyPair', value === 'all' ? '' : value)}>
                <SelectTrigger className="w-full md:w-32 bg-gray-100">
                  <SelectValue placeholder="All Pairs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pairs</SelectItem>
                  <SelectItem value="EURUSD">EUR/USD</SelectItem>
                  <SelectItem value="GBPUSD">GBP/USD</SelectItem>
                  <SelectItem value="USDJPY">USD/JPY</SelectItem>
                  <SelectItem value="USDCHF">USD/CHF</SelectItem>
                  <SelectItem value="AUDUSD">AUD/USD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 whitespace-nowrap">User</Label>
              <Select value={filters.userId || 'all'} onValueChange={(value) => handleFilterChange('userId', value === 'all' ? '' : value)}>
                <SelectTrigger className="w-full md:w-40 bg-gray-100">
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {/* Users will be populated from API */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Show All entries */}
      <div className="bg-white px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {tradesLoading ? 'Loading...' : `Showing ${trades.length} of ${pagination.total} trades`}
          </span>
          <Button variant="outline" size="sm" className="h-6 w-6 p-0">
            <span className="text-xs">+</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <List className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
          <Download className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" onClick={handleExport} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        <Card className="overflow-hidden">
          {tradesLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading forex trades...</p>
            </div>
          ) : trades.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-2">No forex trades found</p>
              <p className="text-sm text-gray-500">Try adjusting your search filters</p>
            </div>
          ) : isMobile ? (
            // Mobile View - Cards
            <div className="p-4 space-y-4">
              {trades.map((trade: any, index: number) => (
                <MobileTradeCard key={trade.id} trade={trade} index={index} />
              ))}
            </div>
          ) : (
            // Desktop View - Table
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">Select</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Currency Pair</TableHead>
                    <TableHead>Side</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.map((trade: any) => (
                    <TableRow key={trade.id} className="hover:bg-gray-50">
                      <TableCell>
                        <input type="radio" name="trade" className="w-4 h-4" />
                      </TableCell>
                      <TableCell className="font-medium">
                        {trade.user?.firstName} {trade.user?.lastName}
                      </TableCell>
                      <TableCell className="font-medium">{trade.instrument?.symbol}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          trade.side === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {trade.side}
                        </span>
                      </TableCell>
                      <TableCell>{trade.quantity}</TableCell>
                      <TableCell>{trade.price?.toLocaleString()}</TableCell>
                      <TableCell>₹{trade.value?.toLocaleString()}</TableCell>
                      <TableCell className={`font-semibold ${
                        (trade.pnl || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ₹{trade.pnl?.toLocaleString() || '0'}
                      </TableCell>
                      <TableCell>₹{trade.commission?.toLocaleString() || '0'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          trade.status === 'FILLED' ? 'bg-green-100 text-green-800' :
                          trade.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          trade.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {trade.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(trade.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="sm" className="h-6 px-2 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button size="sm" className="h-6 px-2 text-xs bg-gray-600 hover:bg-gray-700 text-white">
                            <List className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>

        {/* Pagination */}
        {!tradesLoading && trades.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <div className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total trades)
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="text-xs"
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button 
                    key={pageNum}
                    variant="outline" 
                    size="sm" 
                    className={`text-xs ${pagination.page === pageNum ? 'bg-gray-100' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="text-xs"
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