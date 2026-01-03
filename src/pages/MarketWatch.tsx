import { useState, useEffect, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Plus, Grid3x3, ChevronDown, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'
import { dashboardApi, wsService, formatCurrency, formatNumber } from '../services/api'
import { useApi } from '../hooks/useApi'
import { toast } from 'react-toastify'

export default function MarketWatch() {
  const [selectedMarket, setSelectedMarket] = useState('CRYPTO')
  const [selectedScriptName, setSelectedScriptName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  // Fetch market data from API
  const { 
    data: marketData, 
    loading,
    execute: fetchMarket 
  } = useApi(() => dashboardApi.getMarketData({ segment: selectedMarket === 'ALL' ? undefined : selectedMarket }), { immediate: false })

  // Load data on mount and when segment changes
  useEffect(() => {
    fetchMarket()
  }, [selectedMarket]) // Remove fetchMarket from deps - it's now stable

  // WebSocket subscription for real-time updates
  useEffect(() => {
    const handleMarketUpdate = () => {
      fetchMarket()
    }

    window.addEventListener('ws-market-update', handleMarketUpdate as EventListener)
    wsService.subscribe('market-data')

    return () => {
      window.removeEventListener('ws-market-update', handleMarketUpdate as EventListener)
      wsService.unsubscribe('market-data')
    }
  }, []) // Empty deps - setup once

  const instruments = marketData?.data || []

  // Get unique symbols for filter dropdown
  const uniqueSymbols = useMemo(() => {
    const symbols = instruments.map((inst: any) => inst.symbol).filter(Boolean)
    return [...new Set(symbols)].sort()
  }, [instruments])

  // Apply filters
  const filteredInstruments = useMemo(() => {
    let filtered = instruments
    
    // Filter by symbol
    if (selectedScriptName) {
      filtered = filtered.filter((inst: any) => 
        inst.symbol?.toLowerCase().includes(selectedScriptName.toLowerCase())
      )
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((inst: any) => 
        inst.symbol?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    return filtered
  }, [instruments, selectedScriptName, searchQuery])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await fetchMarket()
      toast.success('Market data refreshed')
    } catch (error) {
      toast.error('Failed to refresh data')
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Title, Search and Buttons */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Market Watch</h1>
            <p className="text-sm text-gray-500 mt-1">
              {filteredInstruments.length} instruments | Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative" style={{ width: '380px' }}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search instruments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-gray-50 border-gray-200 w-full"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={handleRefresh} 
              disabled={refreshing}
              className="h-10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 h-10">
              <Plus className="w-4 h-4 mr-2" />
              Add Script
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Grid3x3 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Row */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-4">
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="w-36 h-10 bg-white">
              <SelectValue placeholder="All Markets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Markets</SelectItem>
              <SelectItem value="CRYPTO">Crypto</SelectItem>
              <SelectItem value="NSE">NSE</SelectItem>
              <SelectItem value="MCX">MCX</SelectItem>
              <SelectItem value="BSE">BSE</SelectItem>
              <SelectItem value="EXTERNAL">External</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedScriptName || "__all__"} onValueChange={(val) => setSelectedScriptName(val === "__all__" ? "" : val)}>
            <SelectTrigger className="w-48 h-10 bg-white">
              <SelectValue placeholder="All Scripts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Scripts</SelectItem>
              {uniqueSymbols.slice(0, 20).map((symbol) => (
                <SelectItem key={String(symbol)} value={String(symbol)}>{String(symbol)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(selectedScriptName || searchQuery) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => { setSelectedScriptName(''); setSearchQuery(''); }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Market Data Section */}
        <Card className="overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Live Market Data</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
                {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>}
              </div>
              <span className="text-sm text-gray-500">
                {filteredInstruments.length} instruments
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700 px-4 py-3">Symbol</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-4 py-3">Segment</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-4 py-3">Bid</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-4 py-3">Ask</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-4 py-3">LTP</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-4 py-3">Change</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-4 py-3">Change %</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-4 py-3">High</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-4 py-3">Low</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-4 py-3">Volume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && filteredInstruments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto mb-2"></div>
                      Loading market data...
                    </TableCell>
                  </TableRow>
                ) : filteredInstruments.length > 0 ? (
                  filteredInstruments.map((instrument: any, index: number) => {
                    // Handle both old and new data formats
                    const symbol = instrument.symbol;
                    const segment = instrument.segment?.name || instrument.segment || 'N/A';
                    const bid = instrument.bidPrice || instrument.bid || 0;
                    const ask = instrument.askPrice || instrument.ask || 0;
                    const ltp = instrument.lastPrice || instrument.ltp || instrument.closePrice || instrument.close || 0;
                    const open = instrument.openPrice || instrument.open || 0;
                    const high = instrument.highPrice || instrument.high || 0;
                    const low = instrument.lowPrice || instrument.low || 0;
                    const volume = instrument.volume || 0;
                    const change = instrument.change || (ltp - open);
                    const changePercent = instrument.changePercent || (open > 0 ? ((ltp - open) / open * 100) : 0);
                    
                    return (
                      <TableRow key={instrument.id || instrument.instrumentId || index} className="hover:bg-gray-50">
                        <TableCell className="font-medium px-4 py-3">{symbol}</TableCell>
                        <TableCell className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            segment === 'NSE' ? 'bg-blue-100 text-blue-700' :
                            segment === 'MCX2' ? 'bg-orange-100 text-orange-700' :
                            segment === 'CRYPTO' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {segment}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3">{formatCurrency(bid)}</TableCell>
                        <TableCell className="px-4 py-3">{formatCurrency(ask)}</TableCell>
                        <TableCell className="px-4 py-3 font-semibold">{formatCurrency(ltp)}</TableCell>
                        <TableCell className={`px-4 py-3 flex items-center ${
                          change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {change >= 0 ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {formatCurrency(change)}
                        </TableCell>
                        <TableCell className={`px-4 py-3 ${
                          changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {changePercent.toFixed(2)}%
                        </TableCell>
                        <TableCell className="px-4 py-3">{formatCurrency(high)}</TableCell>
                        <TableCell className="px-4 py-3">{formatCurrency(low)}</TableCell>
                        <TableCell className="px-4 py-3">{formatNumber(volume, 0)}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                      No market data available. Make sure the backend is running and connected to the price feed.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}
