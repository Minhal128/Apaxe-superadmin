import { useState, useEffect, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, Plus, Grid3x3, ChevronDown, RefreshCw, TrendingUp, TrendingDown, Calendar, FileText } from 'lucide-react'
import { dashboardApi, wsService } from '../services/api'
import { useApi } from '../hooks/useApi'
import { formatCurrency, formatNumber } from '../services/api'
import { toast } from 'react-toastify'

// Segment type definition
interface Segment {
  id: string
  name: string
  type: string
  displayName: string
  isActive: boolean
}

export default function SuperAdminDashboard() {
  const [selectedMarket, setSelectedMarket] = useState('ALL')
  const [selectedScriptName, setSelectedScriptName] = useState('')
  const [selectedExpiry, setSelectedExpiry] = useState('')
  const [selectedCEPE, setSelectedCEPE] = useState('')
  const [selectedStrike, setSelectedStrike] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [segments, setSegments] = useState<Segment[]>([])
  const [loadingSegments, setLoadingSegments] = useState(true)

  // Modal states
  const [isExpiryModalOpen, setIsExpiryModalOpen] = useState(false)
  const [isScriptsModalOpen, setIsScriptsModalOpen] = useState(false)
  const [expiryForm, setExpiryForm] = useState({
    market: '',
    scriptName: '',
    expiryDate: '',
    lotSize: '',
    tickSize: '',
    strikePrice: ''
  })
  const [scriptsForm, setScriptsForm] = useState({
    market: '',
    symbols: [] as string[],
    searchSymbol: ''
  })
  const [availableScripts] = useState([
    { symbol: 'BTCUSD', name: 'Bitcoin/USD' },
    { symbol: 'ETHUSD', name: 'Ethereum/USD' },
    { symbol: 'XRPUSD', name: 'Ripple/USD' },
    { symbol: 'ADAUSD', name: 'Cardano/USD' },
    { symbol: 'SOLUSD', name: 'Solana/USD' },
    { symbol: 'DOTUSD', name: 'Polkadot/USD' },
    { symbol: 'AVAXUSD', name: 'Avalanche/USD' },
    { symbol: 'MATICUSD', name: 'Polygon/USD' },
    { symbol: 'LINKUSD', name: 'Chainlink/USD' },
    { symbol: 'UNIUSD', name: 'Uniswap/USD' },
    { symbol: 'NIFTY', name: 'NIFTY 50' },
    { symbol: 'BANKNIFTY', name: 'Bank Nifty' },
    { symbol: 'RELIANCE', name: 'Reliance Industries' },
    { symbol: 'TCS', name: 'Tata Consultancy Services' },
    { symbol: 'INFY', name: 'Infosys' },
    { symbol: 'HDFC', name: 'HDFC Bank' },
    { symbol: 'GOLD', name: 'Gold' },
    { symbol: 'SILVER', name: 'Silver' },
    { symbol: 'CRUDEOIL', name: 'Crude Oil' },
    { symbol: 'NATURALGAS', name: 'Natural Gas' }
  ])

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

  // Fetch segments on mount
  useEffect(() => {
    const fetchSegments = async () => {
      try {
        setLoadingSegments(true)
        const response = await dashboardApi.getSegments(true)
        const segmentData = response.data?.segments || response.data?.data?.segments || []
        setSegments(segmentData)
      } catch (error) {
        console.error('Failed to fetch segments:', error)
      } finally {
        setLoadingSegments(false)
      }
    }
    fetchSegments()
  }, [])

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
    
    // Filter by market/segment
    if (selectedMarket && selectedMarket !== 'ALL') {
      filtered = filtered.filter((inst: any) => 
        (inst.segment?.name || inst.segment) === selectedMarket
      )
    }
    
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

  // Filtered instruments (all markets or specific market based on selectedMarket)
  const filteredInstruments = useMemo(() => 
    applyFilters(allInstruments), 
    [allInstruments, selectedMarket, selectedScriptName, searchQuery]
  )

  const handleAddExpiry = async () => {
    setIsExpiryModalOpen(true)
  }

  const handleAddScripts = async () => {
    setIsScriptsModalOpen(true)
  }

  const handleExpirySubmit = async () => {
    try {
      if (!expiryForm.market || !expiryForm.scriptName || !expiryForm.expiryDate) {
        toast.error('Please fill in all required fields')
        return
      }
      
      // Call API to add expiry
      await dashboardApi.addInstruments({
        segmentId: expiryForm.market,
        symbols: [expiryForm.scriptName]
      })
      
      toast.success(`Expiry added successfully for ${expiryForm.scriptName}`)
      setIsExpiryModalOpen(false)
      setExpiryForm({
        market: '',
        scriptName: '',
        expiryDate: '',
        lotSize: '',
        tickSize: '',
        strikePrice: ''
      })
      fetchMarketData() // Refresh data
    } catch (error: any) {
      const status = error?.response?.status
      const message = error?.response?.data?.message || error?.response?.data?.error?.message
      
      if (status === 409) {
        toast.error(`Instrument "${expiryForm.scriptName}" already exists in this segment`)
      } else {
        toast.error(message || 'Failed to add expiry')
      }
    }
  }

  const handleScriptsSubmit = async () => {
    try {
      if (!scriptsForm.market || scriptsForm.symbols.length === 0) {
        toast.error('Please select market and at least one script')
        return
      }
      
      // Call API to add scripts
      const response = await dashboardApi.addInstruments({
        segmentId: scriptsForm.market,
        symbols: scriptsForm.symbols
      })
      
      const addedCount = response?.data?.length || scriptsForm.symbols.length
      toast.success(`${addedCount} scripts added/updated successfully`)
      setIsScriptsModalOpen(false)
      setScriptsForm({
        market: '',
        symbols: [],
        searchSymbol: ''
      })
      fetchMarketData() // Refresh data
    } catch (error: any) {
      const status = error?.response?.status
      const message = error?.response?.data?.message || error?.response?.data?.error?.message
      
      if (status === 409) {
        toast.info('Scripts already exist in this segment')
        fetchMarketData() // Refresh to show existing data
      } else {
        toast.error(message || 'Failed to add scripts')
      }
    }
  }

  const toggleScriptSelection = (symbol: string) => {
    setScriptsForm(prev => ({
      ...prev,
      symbols: prev.symbols.includes(symbol)
        ? prev.symbols.filter(s => s !== symbol)
        : [...prev.symbols, symbol]
    }))
  }

  const filteredAvailableScripts = availableScripts.filter(script =>
    script.symbol.toLowerCase().includes(scriptsForm.searchSymbol.toLowerCase()) ||
    script.name.toLowerCase().includes(scriptsForm.searchSymbol.toLowerCase())
  )

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
          <Select value={selectedMarket} onValueChange={setSelectedMarket} disabled={loadingSegments}>
            <SelectTrigger className="w-36 h-10 bg-white">
              <SelectValue placeholder="All Markets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Markets</SelectItem>
              {segments.map((segment) => (
                <SelectItem key={segment.id} value={segment.name}>
                  {segment.displayName || segment.name}
                </SelectItem>
              ))}
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
        {/* Market Data Section */}
        <Card className="overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">{selectedMarket === 'ALL' ? 'All Markets' : selectedMarket}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
                {marketLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>}
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
                {marketLoading && filteredInstruments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto mb-2"></div>
                      Loading market data...
                    </TableCell>
                  </TableRow>
                ) : filteredInstruments.length > 0 ? (
                  filteredInstruments.slice(0, 50).map((instrument: any, index: number) => {
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
                          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
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
                      No market data available. Add instruments using the "Add Scripts" button.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Add Expiry Modal */}
      <Dialog open={isExpiryModalOpen} onOpenChange={setIsExpiryModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" />
              Add New Expiry
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry-market">Market *</Label>
                <Select 
                  value={expiryForm.market} 
                  onValueChange={(val) => setExpiryForm({...expiryForm, market: val})}
                >
                  <SelectTrigger id="expiry-market">
                    <SelectValue placeholder="Select Market" />
                  </SelectTrigger>
                  <SelectContent>
                    {segments.length > 0 ? (
                      segments.map((seg) => (
                        <SelectItem key={seg.id} value={seg.id}>
                          {seg.displayName || seg.name}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="NSE">NSE</SelectItem>
                        <SelectItem value="MCX">MCX</SelectItem>
                        <SelectItem value="BSE">BSE</SelectItem>
                        <SelectItem value="CRYPTO">Crypto</SelectItem>
                        <SelectItem value="FOREX">Forex</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry-script">Script Name *</Label>
                <Input 
                  id="expiry-script"
                  placeholder="e.g., NIFTY, BANKNIFTY"
                  value={expiryForm.scriptName}
                  onChange={(e) => setExpiryForm({...expiryForm, scriptName: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry-date">Expiry Date *</Label>
                <Input 
                  id="expiry-date"
                  type="date"
                  value={expiryForm.expiryDate}
                  onChange={(e) => setExpiryForm({...expiryForm, expiryDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="strike-price">Strike Price</Label>
                <Input 
                  id="strike-price"
                  type="number"
                  placeholder="e.g., 25000"
                  value={expiryForm.strikePrice}
                  onChange={(e) => setExpiryForm({...expiryForm, strikePrice: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lot-size">Lot Size</Label>
                <Input 
                  id="lot-size"
                  type="number"
                  placeholder="e.g., 50"
                  value={expiryForm.lotSize}
                  onChange={(e) => setExpiryForm({...expiryForm, lotSize: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tick-size">Tick Size</Label>
                <Input 
                  id="tick-size"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 0.05"
                  value={expiryForm.tickSize}
                  onChange={(e) => setExpiryForm({...expiryForm, tickSize: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExpiryModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExpirySubmit} className="bg-green-500 hover:bg-green-600">
              Add Expiry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Scripts Modal */}
      <Dialog open={isScriptsModalOpen} onOpenChange={setIsScriptsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-500" />
              Add Scripts to Market Watch
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="scripts-market">Market *</Label>
              <Select 
                value={scriptsForm.market} 
                onValueChange={(val) => setScriptsForm({...scriptsForm, market: val})}
              >
                <SelectTrigger id="scripts-market">
                  <SelectValue placeholder="Select Market" />
                </SelectTrigger>
                <SelectContent>
                  {segments.length > 0 ? (
                    segments.map((seg) => (
                      <SelectItem key={seg.id} value={seg.id}>
                        {seg.displayName || seg.name}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="CRYPTO">Crypto</SelectItem>
                      <SelectItem value="NSE">NSE</SelectItem>
                      <SelectItem value="MCX">MCX</SelectItem>
                      <SelectItem value="BSE">BSE</SelectItem>
                      <SelectItem value="FOREX">Forex</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Search Scripts</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search by symbol or name..."
                  className="pl-10"
                  value={scriptsForm.searchSymbol}
                  onChange={(e) => setScriptsForm({...scriptsForm, searchSymbol: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Available Scripts ({filteredAvailableScripts.length})</Label>
              <div className="border rounded-lg max-h-48 overflow-y-auto">
                {filteredAvailableScripts.map((script) => (
                  <div 
                    key={script.symbol}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 border-b last:border-b-0"
                  >
                    <Checkbox 
                      checked={scriptsForm.symbols.includes(script.symbol)}
                      onCheckedChange={() => toggleScriptSelection(script.symbol)}
                    />
                    <div className="flex-1">
                      <span className="font-medium">{script.symbol}</span>
                      <span className="text-sm text-gray-500 ml-2">{script.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {scriptsForm.symbols.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Scripts ({scriptsForm.symbols.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {scriptsForm.symbols.map((symbol) => (
                    <span 
                      key={symbol}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-md text-sm cursor-pointer hover:bg-green-200"
                      onClick={() => toggleScriptSelection(symbol)}
                    >
                      {symbol}
                      <span className="text-green-500">&times;</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScriptsModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleScriptsSubmit} 
              className="bg-green-500 hover:bg-green-600"
              disabled={scriptsForm.symbols.length === 0}
            >
              Add {scriptsForm.symbols.length} Scripts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}