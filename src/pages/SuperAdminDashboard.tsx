import { useState, useEffect } from 'react'
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
  const [selectedMarket, setSelectedMarket] = useState('NSE')
  const [selectedScriptName, setSelectedScriptName] = useState('')
  const [selectedExpiry, setSelectedExpiry] = useState('')
  const [selectedCEPE, setSelectedCEPE] = useState('')
  const [selectedStrike, setSelectedStrike] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  // Use real API data with real-time updates
  const { 
    data: dashboardData, 
    loading: dashboardLoading, 
    execute: fetchDashboard 
  } = useApi(dashboardApi.getDashboard, { immediate: true })

  const { 
    data: nseData, 
    loading: nseLoading, 
    execute: fetchNSE 
  } = useApi(() => dashboardApi.getMarketWatch('NSE'), { immediate: true })

  const { 
    data: mcxData, 
    loading: mcxLoading, 
    execute: fetchMCX 
  } = useApi(() => dashboardApi.getMarketWatch('MCX'), { immediate: true })

  // WebSocket subscription for real-time updates
  useEffect(() => {
    const handleMarketUpdate = (event: CustomEvent) => {
      const { segment } = event.detail
      if (segment === 'NSE') {
        fetchNSE()
      } else if (segment === 'MCX') {
        fetchMCX()
      }
    }

    window.addEventListener('ws-market-update', handleMarketUpdate as EventListener)
    
    // Subscribe to market data updates
    wsService.subscribe('market-data')

    return () => {
      window.removeEventListener('ws-market-update', handleMarketUpdate as EventListener)
      wsService.unsubscribe('market-data')
    }
  }, [fetchNSE, fetchMCX])

  // Fallback data while loading
  const nseInstruments = nseData?.instruments || []
  const mcxInstruments = mcxData?.instruments || []
  const stats = dashboardData?.stats || {}

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
      await Promise.all([fetchDashboard(), fetchNSE(), fetchMCX()])
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
              <SelectItem value="NSE">NSE</SelectItem>
              <SelectItem value="MCX">MCX</SelectItem>
              <SelectItem value="BSE">BSE</SelectItem>
              <SelectItem value="NCDEX">NCDEX</SelectItem>
              <SelectItem value="FOREX">FOREX</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedScriptName} onValueChange={setSelectedScriptName}>
            <SelectTrigger className="w-36 h-10 bg-white">
              <SelectValue placeholder="Script" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nifty">NIFTY 500</SelectItem>
              <SelectItem value="banknifty">BANKNIFTY</SelectItem>
              <SelectItem value="sensex">SENSEX</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedExpiry} onValueChange={setSelectedExpiry}>
            <SelectTrigger className="w-36 h-10 bg-white">
              <SelectValue placeholder="Expiry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCEPE} onValueChange={setSelectedCEPE}>
            <SelectTrigger className="w-36 h-10 bg-white">
              <SelectValue placeholder="CE/PE" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ce">CE (Call)</SelectItem>
              <SelectItem value="pe">PE (Put)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStrike} onValueChange={setSelectedStrike}>
            <SelectTrigger className="w-36 h-10 bg-white">
              <SelectValue placeholder="Strike" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25000">25000</SelectItem>
              <SelectItem value="25100">25100</SelectItem>
              <SelectItem value="25200">25200</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* NSE Section */}
        <Card className="overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">NSE</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
                {nseLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>}
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
                {nseLoading && nseInstruments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto mb-2"></div>
                      Loading NSE data...
                    </TableCell>
                  </TableRow>
                ) : nseInstruments.length > 0 ? (
                  nseInstruments.slice(0, 20).map((instrument: any, index: number) => (
                    <TableRow key={instrument.id || index} className="hover:bg-gray-50">
                      <TableCell className="font-medium px-4 py-3">{instrument.symbol}</TableCell>
                      <TableCell className="px-4 py-3">{formatCurrency(instrument.currentPrice?.bid || 0)}</TableCell>
                      <TableCell className="px-4 py-3">{formatCurrency(instrument.currentPrice?.ask || 0)}</TableCell>
                      <TableCell className="px-4 py-3 font-semibold">{formatCurrency(instrument.currentPrice?.ltp || 0)}</TableCell>
                      <TableCell className={`px-4 py-3 flex items-center ${
                        (instrument.currentPrice?.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(instrument.currentPrice?.change || 0) >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {formatCurrency(instrument.currentPrice?.change || 0)}
                      </TableCell>
                      <TableCell className={`px-4 py-3 ${
                        (instrument.currentPrice?.changePercent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {((instrument.currentPrice?.changePercent || 0) * 100).toFixed(2)}%
                      </TableCell>
                      <TableCell className="px-4 py-3">{formatCurrency(instrument.currentPrice?.high || 0)}</TableCell>
                      <TableCell className="px-4 py-3">{formatCurrency(instrument.currentPrice?.low || 0)}</TableCell>
                      <TableCell className="px-4 py-3">{formatNumber(instrument.currentPrice?.volume || 0, 0)}</TableCell>
                    </TableRow>
                  ))
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

        {/* MCX Section */}
        <Card className="overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">MCX</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
                {mcxLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>}
              </div>
              <span className="text-sm text-gray-500">
                {mcxInstruments.length} instruments
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
                {mcxLoading && mcxInstruments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto mb-2"></div>
                      Loading MCX data...
                    </TableCell>
                  </TableRow>
                ) : mcxInstruments.length > 0 ? (
                  mcxInstruments.slice(0, 20).map((instrument: any, index: number) => (
                    <TableRow key={instrument.id || index} className="hover:bg-gray-50">
                      <TableCell className="font-medium px-4 py-3">{instrument.symbol}</TableCell>
                      <TableCell className="px-4 py-3">{formatCurrency(instrument.currentPrice?.bid || 0)}</TableCell>
                      <TableCell className="px-4 py-3">{formatCurrency(instrument.currentPrice?.ask || 0)}</TableCell>
                      <TableCell className="px-4 py-3 font-semibold">{formatCurrency(instrument.currentPrice?.ltp || 0)}</TableCell>
                      <TableCell className={`px-4 py-3 flex items-center ${
                        (instrument.currentPrice?.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(instrument.currentPrice?.change || 0) >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {formatCurrency(instrument.currentPrice?.change || 0)}
                      </TableCell>
                      <TableCell className={`px-4 py-3 ${
                        (instrument.currentPrice?.changePercent || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {((instrument.currentPrice?.changePercent || 0) * 100).toFixed(2)}%
                      </TableCell>
                      <TableCell className="px-4 py-3">{formatCurrency(instrument.currentPrice?.high || 0)}</TableCell>
                      <TableCell className="px-4 py-3">{formatCurrency(instrument.currentPrice?.low || 0)}</TableCell>
                      <TableCell className="px-4 py-3">{formatNumber(instrument.currentPrice?.volume || 0, 0)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No MCX data available
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