import { useState, useEffect, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Plus, Grid3x3, ChevronDown, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'
import { dashboardApi, wsService } from '../services/api'
import { useApi } from '../hooks/useApi'
import { formatCurrency, formatNumber } from '../services/api'
import { toast } from 'react-toastify'

export default function SuperAdminDashboard() {
  const [selectedMarket, setSelectedMarket] = useState('CRYPTO')
  const [selectedScriptName, setSelectedScriptName] = useState('')
  const [selectedExpiry, setSelectedExpiry] = useState('')
  const [selectedCEPE, setSelectedCEPE] = useState('')
  const [selectedStrike, setSelectedStrike] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  // Use real API data with real-time updates
  const { 
    data: dashboardData, 
    loading: dashboardLoading, 
    execute: fetchDashboard 
  } = useApi(dashboardApi.getDashboard, { immediate: true })

  const { 
    data: marketData, 
    loading: marketLoading, 
    execute: fetchMarketData 
  } = useApi(() => dashboardApi.getMarketData(), { immediate: true })

  // WebSocket subscription for real-time updates
  useEffect(() => {
    const handleMarketUpdate = () => {
      fetchMarketData()
    }

    window.addEventListener('ws-market-update', handleMarketUpdate as EventListener)
    
    // Subscribe to market data updates
    wsService.subscribe('market-data')

    return () => {
      window.removeEventListener('ws-market-update', handleMarketUpdate as EventListener)
      wsService.unsubscribe('market-data')
    }
  }, []) // Remove fetchMarketData from deps - it's stable but we only want to set this up once

  // Raw data from API
  const allInstruments = marketData?.data || []
  const stats = dashboardData?.stats || {}

  // Get unique values for filter dropdowns
  const uniqueSymbols = useMemo(() => {
    const symbols = allInstruments.map((inst: any) => inst.symbol).filter(Boolean)
    return [...new Set(symbols)].sort()
  }, [allInstruments])

  // Apply filters to instruments
  const applyFilters = (instruments: any[]) => {
    let filtered = instruments
    
    // Filter by script name
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
  }

  // Filtered instruments by segment
  const cryptoInstruments = useMemo(() => 
    applyFilters(allInstruments.filter((inst: any) => (inst.segment?.name || inst.segment) === 'CRYPTO')), 
    [allInstruments, selectedScriptName, searchQuery]
  )
  
  const nseInstruments = useMemo(() => 
    applyFilters(allInstruments.filter((inst: any) => (inst.segment?.name || inst.segment) === 'NSE')), 
    [allInstruments, selectedScriptName, searchQuery]
  )

  const handleAddExpiry = async () => {
    // TODO: Implement add expiry functionality
    toast.info('Add expiry functionality coming soon')
  }

  const handleAddScripts = async () => {
    // TODO: Implement add scripts functionality
    toast.info('Add scripts functionality coming soon')
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await Promise.all([fetchDashboard(), fetchMarketData()])
      toast.success('Data refreshed successfully')
    } catch (error) {
      toast.error('Failed to refresh data')
    } finally {
      setRefreshing(false)
    }
  }

  if (dashboardLoading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Title, Search and Buttons */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">SuperAdmin Dashboard</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span>Users: {formatNumber(stats.totalUsers || 0, 0)}</span>
              <span>Trades: {formatNumber(stats.totalTrades || 0, 0)}</span>
              <span>Volume: {formatCurrency(stats.totalVolume || 0)}</span>
              <span>Open Positions: {formatNumber(stats.openPositions || 0, 0)}</span>
            </div>
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
            <Button className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 h-10" onClick={handleAddExpiry}>
              <Plus className="w-4 h-4 mr-2" />
              Expiry
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 h-10" onClick={handleAddScripts}>
              <Plus className="w-4 h-4 mr-2" />
              Scripts
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
              <SelectValue placeholder="NSE" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CRYPTO">CRYPTO</SelectItem>
              <SelectItem value="NSE">NSE</SelectItem>
              <SelectItem value="MCX">MCX</SelectItem>
              <SelectItem value="BSE">BSE</SelectItem>
              <SelectItem value="NCDEX">NCDEX</SelectItem>
              <SelectItem value="FOREX">FOREX</SelectItem>
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

          <Select value={selectedExpiry || "__all__"} onValueChange={(val) => setSelectedExpiry(val === "__all__" ? "" : val)}>
            <SelectTrigger className="w-36 h-10 bg-white">
              <SelectValue placeholder="Expiry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Expiry</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCEPE || "__all__"} onValueChange={(val) => setSelectedCEPE(val === "__all__" ? "" : val)}>
            <SelectTrigger className="w-36 h-10 bg-white">
              <SelectValue placeholder="CE/PE" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All</SelectItem>
              <SelectItem value="ce">CE (Call)</SelectItem>
              <SelectItem value="pe">PE (Put)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStrike || "__all__"} onValueChange={(val) => setSelectedStrike(val === "__all__" ? "" : val)}>
            <SelectTrigger className="w-36 h-10 bg-white">
              <SelectValue placeholder="Strike" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Strikes</SelectItem>
              <SelectItem value="25000">25000</SelectItem>
              <SelectItem value="25100">25100</SelectItem>
              <SelectItem value="25200">25200</SelectItem>
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
        {/* CRYPTO Section */}
        <Card className="overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">CRYPTO</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
                {marketLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>}
              </div>
              <span className="text-sm text-gray-500">
                {cryptoInstruments.length} instruments
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700 px-4 py-3">Symbol</TableHead>
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
                {marketLoading && cryptoInstruments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto mb-2"></div>
                      Loading CRYPTO data...
                    </TableCell>
                  </TableRow>
                ) : cryptoInstruments.length > 0 ? (
                  cryptoInstruments.slice(0, 20).map((instrument: any, index: number) => {
                    // Handle both old and new data formats
                    const symbol = instrument.symbol;
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
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No CRYPTO data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* NSE Section */}
        <Card className="overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">NSE</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
                {marketLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>}
              </div>
              <span className="text-sm text-gray-500">
                {nseInstruments.length} instruments
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700 px-4 py-3">Symbol</TableHead>
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
                {marketLoading && nseInstruments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto mb-2"></div>
                      Loading NSE data...
                    </TableCell>
                  </TableRow>
                ) : nseInstruments.length > 0 ? (
                  nseInstruments.slice(0, 20).map((instrument: any, index: number) => {
                    // Handle both old and new data formats
                    const symbol = instrument.symbol;
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
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No NSE data available
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