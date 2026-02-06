import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Download, List, Trash2, ChevronDown, ChevronUp, Loader2, RefreshCw } from 'lucide-react'
import { tradingApi, userApi, dashboardApi } from '../../services/api'
import { useApi } from '../../hooks/useApi'
import { toast } from 'react-toastify'

// Available segments for trading
const SEGMENTS = [
  { id: 'NSE', name: 'NSE' },
  { id: 'BSE', name: 'BSE' },
  { id: 'NFO', name: 'NFO' },
  { id: 'MCX', name: 'MCX' },
  { id: 'CDS', name: 'CDS' },
]

interface ManualTradeHistory {
  id: string
  time: string
  client: string
  market: string
  script: string
  side: string
  lot: number
  qty: number
  orderPrice: number
  netPrice: number
  addedBy: string
  status: string
}

export default function ManualTrade() {
  const [brokerage, setBrokerage] = useState('with')
  const [expandedRows, setExpandedRows] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tradeForm, setTradeForm] = useState({
    tradeDate: new Date().toISOString().split('T')[0],
    segmentId: '',
    instrumentId: '',
    lot: 1,
    quantity: 1,
    price: 0,
    userId: '',
    reason: 'Manual trade by admin'
  })

  // API calls
  const { data: usersResponse } = useApi(userApi.getUsers, { immediate: true })
  const { data: instrumentsResponse, execute: fetchInstruments } = useApi(
    () => dashboardApi.getMarketData({ segment: tradeForm.segmentId }),
    { immediate: false }
  )
  
  const { 
    data: tradesResponse, 
    loading: tradesLoading, 
    execute: fetchTrades 
  } = useApi(tradingApi.getAllTrades, { 
    immediate: true,
    onError: () => {
      // Silently handle errors - use fallback data
    }
  })

  // Fetch instruments when segment changes
  useEffect(() => {
    if (tradeForm.segmentId) {
      fetchInstruments({ segmentId: tradeForm.segmentId })
    }
  }, [tradeForm.segmentId, fetchInstruments])

  // Auto-refresh trades every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTrades({ limit: 20 })
    }, 10000)
    return () => clearInterval(interval)
  }, [fetchTrades])

  const handleFormChange = (key: string, value: string | number) => {
    setTradeForm(prev => ({ ...prev, [key]: value }))
  }

  const handleTrade = async (side: 'BUY' | 'SELL') => {
    if (!tradeForm.userId || !tradeForm.instrumentId) {
      toast.error('Please select client and instrument')
      return
    }

    if (tradeForm.quantity < 1) {
      toast.error('Quantity must be at least 1')
      return
    }

    setIsSubmitting(true)
    try {
      await tradingApi.executeManualTrade({
        userId: tradeForm.userId,
        instrumentId: tradeForm.instrumentId,
        side,
        quantity: tradeForm.quantity,
        price: tradeForm.price || undefined,
        orderType: tradeForm.price > 0 ? 'LIMIT' : 'MARKET',
        reason: tradeForm.reason || 'Manual trade by admin'
      })
      
      toast.success(`${side} order executed successfully`)
      fetchTrades({ limit: 20 }) // Refresh trades list
      
      // Reset form
      setTradeForm(prev => ({
        ...prev,
        quantity: 1,
        lot: 1,
        price: 0
      }))
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || error?.response?.data?.message || 'Failed to execute trade')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleRow = (index: number) => {
    setExpandedRows(prev =>
      prev.includes(index)
        ? prev.filter(item => item !== index)
        : [...prev, index]
    )
  }

  // Process data from API responses
  // API returns { success, message, data: [...users], meta: {...} }
  const users = Array.isArray(usersResponse?.data) ? usersResponse.data : []
  const instruments = Array.isArray(instrumentsResponse?.data) ? instrumentsResponse.data : (instrumentsResponse?.data?.data || [])
  const trades = tradesResponse?.data || []

  // Transform trades for display
  const manualTradeData: ManualTradeHistory[] = (Array.isArray(trades) ? trades : []).slice(0, 20).map((trade: any) => ({
    id: trade.id,
    time: new Date(trade.executedAt || trade.createdAt).toLocaleTimeString(),
    client: trade.user?.username || trade.userId || 'N/A',
    market: trade.instrument?.segment?.name || trade.segment || 'N/A',
    script: trade.instrument?.symbol || trade.symbol || 'N/A',
    side: trade.side,
    lot: Math.floor(trade.quantity / (trade.instrument?.lotSize || 1)),
    qty: trade.quantity,
    orderPrice: trade.price,
    netPrice: trade.value,
    addedBy: trade.executedBy || 'Admin',
    status: trade.status || 'Executed'
  }))

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Manual Trade</h1>
          <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => fetchTrades({ limit: 20 })}>
            <RefreshCw className={`w-4 h-4 ${tradesLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Trade Form */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Trade date</Label>
            <div className="relative">
              <Input
                type="date"
                value={tradeForm.tradeDate}
                onChange={(e) => handleFormChange('tradeDate', e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Segment</Label>
            <Select value={tradeForm.segmentId} onValueChange={(v) => handleFormChange('segmentId', v)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select Segment" />
              </SelectTrigger>
              <SelectContent>
                {SEGMENTS.map((seg) => (
                  <SelectItem key={seg.id} value={seg.id}>{seg.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Script</Label>
            <Select value={tradeForm.instrumentId} onValueChange={(v) => handleFormChange('instrumentId', v)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select Script" />
              </SelectTrigger>
              <SelectContent>
                {instruments.map((inst: any) => (
                  <SelectItem key={inst.id || inst.symbol} value={inst.id || inst.symbol}>{inst.symbol || inst.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Lot</Label>
            <Input
              type="number"
              min={1}
              value={tradeForm.lot}
              onChange={(e) => handleFormChange('lot', parseInt(e.target.value) || 1)}
              className="h-10"
            />
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-2 block">QTY</Label>
            <Input
              type="number"
              min={1}
              value={tradeForm.quantity}
              onChange={(e) => handleFormChange('quantity', parseInt(e.target.value) || 1)}
              className="h-10"
            />
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Price (0 = Market)</Label>
            <Input
              type="number"
              min={0}
              step={0.01}
              value={tradeForm.price}
              onChange={(e) => handleFormChange('price', parseFloat(e.target.value) || 0)}
              className="h-10"
              placeholder="0 for market price"
            />
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Client</Label>
            <Select value={tradeForm.userId} onValueChange={(v) => handleFormChange('userId', v)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select Client" />
              </SelectTrigger>
              <SelectContent>
                {users.filter((u: any) => u.role === 'CLIENT' || u.role === 'USER').map((user: any) => (
                  <SelectItem key={user.id} value={user.id}>{user.username}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-200">
          <RadioGroup value={brokerage} onValueChange={setBrokerage} className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="with" id="with" />
              <Label htmlFor="with" className="text-sm font-medium cursor-pointer">With Brokerage</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="without" id="without" />
              <Label htmlFor="without" className="text-sm font-medium cursor-pointer">Without Brokerage</Label>
            </div>
          </RadioGroup>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              className="bg-green-500 hover:bg-green-600 text-white h-10 flex-1 sm:flex-none"
              onClick={() => handleTrade('BUY')}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Buy
            </Button>
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white h-10 flex-1 sm:flex-none"
              onClick={() => handleTrade('SELL')}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Sell
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <Card className="overflow-hidden">
          <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-2">
              <List className="w-4 h-4 text-gray-500" />
              <Download className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
            </div>
            <span className="text-sm text-gray-500">
              {tradesLoading ? 'Loading...' : `${manualTradeData.length} recent trades`}
            </span>
          </div>
          
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3 p-4">
            {tradesLoading && manualTradeData.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
              </div>
            ) : manualTradeData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No trades found</div>
            ) : (
              manualTradeData.map((row, index) => (
                <div key={row.id || index} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div 
                    className="flex justify-between items-start cursor-pointer"
                    onClick={() => toggleRow(index)}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-gray-500">Time:</span>
                        <span className="text-sm font-medium text-gray-900">{row.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-gray-500">Client:</span>
                        <span className="text-sm text-gray-900">{row.client}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-gray-500">Script:</span>
                        <span className="text-sm text-gray-900 truncate max-w-[120px]">{row.script}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-gray-500">Side:</span>
                        <span className={`text-sm font-medium ${row.side === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                          {row.side}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      {expandedRows.includes(index) ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {expandedRows.includes(index) && (
                    <div className="mt-4 space-y-3 border-t pt-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-xs font-medium text-gray-500">Market:</span>
                          <p className="text-sm text-gray-900">{row.market}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500">Lot:</span>
                          <p className="text-sm text-gray-900">{row.lot}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500">Qty:</span>
                          <p className="text-sm text-gray-900">{row.qty}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500">Price:</span>
                          <p className="text-sm text-gray-900">₹{formatCurrency(row.orderPrice)}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500">Value:</span>
                          <p className="text-sm text-gray-900">₹{formatCurrency(row.netPrice)}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500">Status:</span>
                          <p className="text-sm text-gray-900">{row.status}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700 min-w-[80px]">Time</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">Client</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">Market</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[120px]">Script</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[80px]">Side</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[60px]">Lot</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[60px]">QTY</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[120px]">Order Price</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[120px]">Net Value</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">Added by</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[80px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tradesLoading && manualTradeData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-gray-500 mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : manualTradeData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                      No trades found
                    </TableCell>
                  </TableRow>
                ) : (
                  manualTradeData.map((row, index) => (
                    <TableRow key={row.id || index} className="hover:bg-gray-50">
                      <TableCell className="text-xs sm:text-sm">{row.time}</TableCell>
                      <TableCell className="text-xs sm:text-sm font-medium">{row.client}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{row.market}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{row.script}</TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          row.side === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {row.side}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">{row.lot}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{row.qty}</TableCell>
                      <TableCell className="text-xs sm:text-sm">₹{formatCurrency(row.orderPrice)}</TableCell>
                      <TableCell className="text-xs sm:text-sm">₹{formatCurrency(row.netPrice)}</TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          row.status === 'EXECUTED' || row.status === 'Executed' 
                            ? 'bg-green-100 text-green-700' 
                            : row.status === 'PENDING' 
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}>
                          {row.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">{row.addedBy}</TableCell>
                      <TableCell>
                        <Trash2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-600" />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}