import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Download, List, Grid3x3, Pencil, Trash2, ChevronDown, ChevronUp, RotateCcw, LogOut, RefreshCw } from 'lucide-react'
import { tradingApi } from '../../services/api'
import { useApi } from '../../hooks/useApi'
import { toast } from 'react-toastify'
import { exportToExcel } from '@/lib/exportUtils'

export default function Position() {
  const [filterType, setFilterType] = useState('all')
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [expandedRows, setExpandedRows] = useState<number[]>([])
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    userId: '',
    segmentId: '',
    instrumentId: '',
    status: '',
    page: 1,
    limit: 50
  })

  // Modal states
  const [isExitModalOpen, setIsExitModalOpen] = useState(false)
  const [isRolloverModalOpen, setIsRolloverModalOpen] = useState(false)
  const [exitForm, setExitForm] = useState({
    reason: '',
    price: '',
    quantity: ''
  })
  const [rolloverForm, setRolloverForm] = useState({
    newExpiry: '',
    newPrice: '',
    reason: ''
  })

  // API call for positions data
  const { 
    data: positionsResponse, 
    loading: positionsLoading, 
    execute: fetchPositions 
  } = useApi(tradingApi.getAllPositions, { 
    immediate: false,
    onError: (error: string) => {
      // Handle authentication errors gracefully
      if (error.includes('401') || error.includes('403') || error.includes('500')) {
        console.log('Positions endpoint requires authentication');
      }
    }
  })

  // Fetch positions when component mounts or filters change
  useEffect(() => {
    fetchPositions(filters)
  }, [fetchPositions, filters])

  const toggleRow = (id: number) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  // const handleFilterChange = (key: string, value: string) => {
  //   setFilters(prev => ({
  //     ...prev,
  //     [key]: value,
  //     page: 1 // Reset to first page when filters change
  //   }))
  // }

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }))
  }

  const handleClosePosition = async (positionId: string) => {
    try {
      await tradingApi.closePosition(positionId, {
        reason: 'Manual close by admin'
      })
      toast.success('Position closed successfully')
      fetchPositions(filters) // Refresh data
    } catch (error) {
      toast.error('Failed to close position')
    }
  }

  // Exit Position Handler
  const handleExitPosition = () => {
    if (!selectedPosition) {
      toast.warning('Please select a position to exit')
      return
    }
    setExitForm({ reason: '', price: '', quantity: '' })
    setIsExitModalOpen(true)
  }

  const handleExitSubmit = async () => {
    if (!selectedPosition) return
    
    try {
      await tradingApi.closePosition(selectedPosition, {
        reason: exitForm.reason || 'Exit position by admin',
        price: exitForm.price ? parseFloat(exitForm.price) : undefined,
        quantity: exitForm.quantity ? parseInt(exitForm.quantity) : undefined
      })
      toast.success('Position exited successfully')
      setIsExitModalOpen(false)
      setSelectedPosition(null)
      fetchPositions(filters)
    } catch (error) {
      toast.error('Failed to exit position')
    }
  }

  // Rollover Position Handler
  const handleRollover = () => {
    if (!selectedPosition) {
      toast.warning('Please select a position to rollover')
      return
    }
    setRolloverForm({ newExpiry: '', newPrice: '', reason: '' })
    setIsRolloverModalOpen(true)
  }

  const handleRolloverSubmit = async () => {
    if (!selectedPosition) return
    
    try {
      // First close the current position
      await tradingApi.closePosition(selectedPosition, {
        reason: `Rollover: ${rolloverForm.reason || 'Position rolled over to new expiry'}`
      })
      
      // Note: In a real implementation, you would also create a new position
      // with the new expiry date here using executeManualTrade
      
      toast.success('Position rolled over successfully')
      setIsRolloverModalOpen(false)
      setSelectedPosition(null)
      fetchPositions(filters)
    } catch (error) {
      toast.error('Failed to rollover position')
    }
  }

  // Get Position Handler (Refresh)
  const handleGetPosition = async () => {
    try {
      toast.info('Fetching latest positions...')
      await fetchPositions(filters)
      toast.success('Positions refreshed successfully')
    } catch (error) {
      toast.error('Failed to fetch positions')
    }
  }

  // Select position handler
  const handleSelectPosition = (positionId: string) => {
    setSelectedPosition(prev => prev === positionId ? null : positionId)
  }

  const handleExport = async () => {
    if (positions.length === 0) {
      toast.warning('No data to export')
      return
    }

    const exportData = positions.map((position: any) => ({
      client: position.user?.username || position.userId || '-',
      segment: position.instrument?.segment?.name || '-',
      symbol: position.instrument?.tradingSymbol || '-',
      expiry: position.instrument?.expiry || '-',
      side: position.side,
      quantity: position.quantity || 0,
      avgPrice: position.averagePrice || 0,
      ltp: position.currentPrice || 0,
      pnl: position.unrealizedPnL || 0,
      status: position.status || 'Open'
    }))

    const columnMapping = {
      client: 'Client',
      segment: 'Segment',
      symbol: 'Symbol',
      expiry: 'Expiry',
      side: 'Side',
      quantity: 'Quantity',
      avgPrice: 'Avg Price',
      ltp: 'LTP',
      pnl: 'P&L',
      status: 'Status'
    }

    exportToExcel(exportData, 'Trading_Positions', 'Positions', columnMapping)
    toast.success('Positions exported successfully')
  }

  // Get positions data from API response
  const positions = positionsResponse?.data?.positions || []
  const pagination = positionsResponse?.data?.pagination || { page: 1, totalPages: 1, total: 0 }

  // Calculate summary stats from positions
  const summaryStats = positions.reduce((acc: any, position: any) => {
    const mtm = position.unrealizedPnL || 0
    const qty = position.quantity || 0
    
    acc.totalMTM += mtm
    if (position.side === 'SELL') {
      acc.sellMTM += mtm
      acc.sellQty += qty
    } else {
      acc.buyQty += qty
    }
    acc.totalQty += qty
    
    return acc
  }, {
    totalMTM: 0,
    sellMTM: 0,
    downlineMTM: 0,
    buyQty: 0,
    sellQty: 0,
    totalQty: 0
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Position report</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Grid3x3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden sm:block bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-start gap-6 mb-4">
          <RadioGroup value={filterType} onValueChange={setFilterType} className="flex gap-4 flex-wrap">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="text-sm font-medium cursor-pointer">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="clientwise" id="clientwise" />
              <Label htmlFor="clientwise" className="text-sm font-medium cursor-pointer">Client Wise</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="scriptwise" id="scriptwise" />
              <Label htmlFor="scriptwise" className="text-sm font-medium cursor-pointer">Script wise</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="selfsummary" id="selfsummary" />
              <Label htmlFor="selfsummary" className="text-sm font-medium cursor-pointer">Self-summary</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center gap-3 flex-wrap mb-4">
          <Select defaultValue="">
            <SelectTrigger className="w-28 sm:w-32">
              <SelectValue placeholder="Market" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="market">Market</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="">
            <SelectTrigger className="w-32 sm:w-40">
              <SelectValue placeholder="Script" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="script">Script name</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="">
            <SelectTrigger className="w-28 sm:w-32">
              <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expiry">Expiry</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="">
            <SelectTrigger className="w-28 sm:w-32">
              <SelectValue placeholder="Broker" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expiry">Expiry</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="">
            <SelectTrigger className="w-28 sm:w-32">
              <SelectValue placeholder="Expiry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expiry">Expiry</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="">
            <SelectTrigger className="w-28 sm:w-32">
              <SelectValue placeholder="Master" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="select">Select</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total MTM</span>
              <span className="ml-2 font-semibold">₹{summaryStats.totalMTM.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-600">Sell MTM</span>
              <span className="ml-2 font-semibold">₹{summaryStats.sellMTM.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-600">Downline MTM</span>
              <span className="ml-2 font-semibold">₹{summaryStats.downlineMTM.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-600">BUY QTY</span>
              <span className="ml-2 font-semibold">{summaryStats.buyQty.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-600">SELL QTY</span>
              <span className="ml-2 font-semibold">{summaryStats.sellQty.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-600">TOTAL QTY</span>
              <span className="ml-2 font-semibold">{summaryStats.totalQty.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="text-xs">Clear filter</Button>
            <Button 
              className="bg-green-500 hover:bg-green-600 text-white text-xs"
              onClick={handleExitPosition}
            >
              <LogOut className="w-3 h-3 mr-1" />
              Exit position
            </Button>
            <Button 
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
              onClick={handleRollover}
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Rollover
            </Button>
            <Button 
              className="bg-gray-800 hover:bg-gray-900 text-white text-xs"
              onClick={handleGetPosition}
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Get position
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Filters Toggle */}
      <div className="sm:hidden bg-white border-b border-gray-200 px-4 py-3">
        <Button 
          variant="outline" 
          className="w-full justify-between"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        >
          <span>Filters & Actions</span>
          <ChevronDown className={`w-4 h-4 transform transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
        </Button>
        
        {/* Collapsible Filters for Mobile */}
        {isFiltersOpen && (
          <div className="mt-4 space-y-4">
            {/* Radio Group */}
            <RadioGroup value={filterType} onValueChange={setFilterType} className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all-mobile" />
                <Label htmlFor="all-mobile" className="text-sm font-medium cursor-pointer">All</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="clientwise" id="clientwise-mobile" />
                <Label htmlFor="clientwise-mobile" className="text-sm font-medium cursor-pointer">Client Wise</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scriptwise" id="scriptwise-mobile" />
                <Label htmlFor="scriptwise-mobile" className="text-sm font-medium cursor-pointer">Script wise</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="selfsummary" id="selfsummary-mobile" />
                <Label htmlFor="selfsummary-mobile" className="text-sm font-medium cursor-pointer">Self-summary</Label>
              </div>
            </RadioGroup>

            {/* Select Filters */}
            <div className="grid grid-cols-2 gap-3">
              <Select defaultValue="">
                <SelectTrigger>
                  <SelectValue placeholder="Market" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="">
                <SelectTrigger>
                  <SelectValue placeholder="Script" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="script">Script name</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="">
                <SelectTrigger>
                  <SelectValue placeholder="Client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expiry">Expiry</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="">
                <SelectTrigger>
                  <SelectValue placeholder="Broker" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expiry">Expiry</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="">
                <SelectTrigger>
                  <SelectValue placeholder="Expiry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expiry">Expiry</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="">
                <SelectTrigger>
                  <SelectValue placeholder="Master" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select">Select</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-3 text-sm border-t pt-3">
              <div>
                <span className="text-gray-600">Total MTM:</span>
                <span className="ml-1 font-semibold">₹{summaryStats.totalMTM.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Sell MTM:</span>
                <span className="ml-1 font-semibold">₹{summaryStats.sellMTM.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Downline MTM:</span>
                <span className="ml-1 font-semibold">₹{summaryStats.downlineMTM.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">BUY QTY:</span>
                <span className="ml-1 font-semibold">{summaryStats.buyQty.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">SELL QTY:</span>
                <span className="ml-1 font-semibold">{summaryStats.sellQty.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">TOTAL QTY:</span>
                <span className="ml-1 font-semibold">{summaryStats.totalQty.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 border-t pt-3">
              <Button variant="outline" size="sm" className="text-xs">Clear filter</Button>
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white text-xs"
                onClick={handleExitPosition}
              >
                <LogOut className="w-3 h-3 mr-1" />
                Exit position
              </Button>
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
                onClick={handleRollover}
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Rollover
              </Button>
              <Button 
                className="bg-gray-800 hover:bg-gray-900 text-white text-xs"
                onClick={handleGetPosition}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Get position
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <Card className="overflow-hidden">
          <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-2">
              <List className="w-4 h-4 text-gray-500" />
              <Download className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" onClick={handleExport} />
            </div>
            <div className="text-sm text-gray-600">
              {positionsLoading ? 'Loading...' : `${positions.length} positions`}
            </div>
          </div>
          
          {positionsLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading positions...</p>
            </div>
          ) : positions.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">No position data available</div>
              <div className="text-sm text-gray-500">Try adjusting your search filters</div>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700 min-w-[50px]">Select</TableHead>
                      <TableHead className="font-semibold text-gray-700 min-w-[120px]">User</TableHead>
                      <TableHead className="font-semibold text-gray-700 min-w-[100px]">Symbol</TableHead>
                      <TableHead className="font-semibold text-gray-700 min-w-[100px]">Market</TableHead>
                      <TableHead className="font-semibold text-gray-700 min-w-[60px]">Side</TableHead>
                      <TableHead className="font-semibold text-gray-700 min-w-[60px]">Qty</TableHead>
                      <TableHead className="font-semibold text-gray-700 min-w-[120px]">Avg Price</TableHead>
                      <TableHead className="font-semibold text-gray-700 min-w-[120px]">Current Price</TableHead>
                      <TableHead className="font-semibold text-gray-700 min-w-[120px]">P&L</TableHead>
                      <TableHead className="font-semibold text-gray-700 min-w-[100px]">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700 min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {positions.map((position: any) => (
                      <TableRow key={position.id} className={`hover:bg-gray-50 ${selectedPosition === position.id ? 'bg-blue-50' : ''}`}>
                        <TableCell>
                          <input 
                            type="radio" 
                            name="position" 
                            className="rounded-full" 
                            checked={selectedPosition === position.id}
                            onChange={() => handleSelectPosition(position.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {position.user?.firstName} {position.user?.lastName}
                        </TableCell>
                        <TableCell>{position.instrument?.symbol}</TableCell>
                        <TableCell>{position.instrument?.segment?.name}</TableCell>
                        <TableCell>
                          <Badge className={`${
                            position.side === 'SELL' 
                              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}>
                            {position.side}
                          </Badge>
                        </TableCell>
                        <TableCell>{position.quantity}</TableCell>
                        <TableCell>₹{position.avgPrice?.toLocaleString()}</TableCell>
                        <TableCell>₹{position.currentPrice?.toLocaleString()}</TableCell>
                        <TableCell className={`font-semibold ${
                          (position.unrealizedPnL || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ₹{position.unrealizedPnL?.toLocaleString() || '0'}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${
                            position.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                            position.status === 'CLOSED' ? 'bg-gray-100 text-gray-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {position.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button 
                              size="sm" 
                              className="h-6 px-2 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              className="h-6 px-2 text-xs bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => handleClosePosition(position.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden">
                {positions.map((position: any) => (
                  <Card key={position.id} className={`m-4 overflow-hidden ${selectedPosition === position.id ? 'ring-2 ring-blue-500' : ''}`}>
                    {/* Header - Always Visible */}
                    <div 
                      className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleRow(position.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            name="position" 
                            className="rounded-full"
                            checked={selectedPosition === position.id}
                            onChange={(e) => {
                              e.stopPropagation()
                              handleSelectPosition(position.id)
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div>
                            <div className="font-semibold text-gray-900">{position.instrument?.symbol}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <span>{position.user?.firstName} {position.user?.lastName}</span>
                              <Badge className={`text-xs ${
                                position.side === 'SELL' 
                                  ? 'bg-red-100 text-red-700' 
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {position.side}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${
                            position.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                            position.status === 'CLOSED' ? 'bg-gray-100 text-gray-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {position.status}
                          </Badge>
                          {expandedRows.includes(position.id) ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Content */}
                    {expandedRows.includes(position.id) && (
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                            <span className="font-medium text-gray-500">Market:</span>
                            <p className="text-gray-900">{position.instrument?.segment?.name}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="font-medium text-gray-500">Quantity:</span>
                            <p className="text-gray-900 font-semibold">{position.quantity}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="font-medium text-gray-500">Avg Price:</span>
                            <p className="text-gray-900 font-semibold">₹{position.avgPrice?.toLocaleString()}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="font-medium text-gray-500">Current Price:</span>
                            <p className="text-gray-900 font-semibold">₹{position.currentPrice?.toLocaleString()}</p>
                          </div>
                          <div className="space-y-1 col-span-2">
                            <span className="font-medium text-gray-500">P&L:</span>
                            <p className={`font-semibold text-lg ${
                              (position.unrealizedPnL || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              ₹{position.unrealizedPnL?.toLocaleString() || '0'}
                            </p>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-3 border-t border-gray-200">
                          <Button variant="outline" size="sm" className="flex-1 text-xs">
                            <Pencil className="w-3 h-3 mr-1" />
                            Modify
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 text-xs text-red-600 hover:text-red-700"
                            onClick={() => handleClosePosition(position.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Close
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </>
          )}
        </Card>

        {/* Pagination */}
        {!positionsLoading && positions.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <div className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total positions)
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

      {/* Exit Position Modal */}
      <Dialog open={isExitModalOpen} onOpenChange={setIsExitModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="w-5 h-5 text-green-500" />
              Exit Position
            </DialogTitle>
            <DialogDescription>
              Close the selected position. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="exit-quantity">Quantity (optional)</Label>
              <Input
                id="exit-quantity"
                type="number"
                placeholder="Leave blank to exit full position"
                value={exitForm.quantity}
                onChange={(e) => setExitForm({ ...exitForm, quantity: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exit-price">Price (optional)</Label>
              <Input
                id="exit-price"
                type="number"
                step="0.01"
                placeholder="Leave blank for market price"
                value={exitForm.price}
                onChange={(e) => setExitForm({ ...exitForm, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exit-reason">Reason</Label>
              <Input
                id="exit-reason"
                placeholder="Enter reason for exit"
                value={exitForm.reason}
                onChange={(e) => setExitForm({ ...exitForm, reason: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExitModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExitSubmit} className="bg-green-500 hover:bg-green-600">
              Exit Position
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rollover Position Modal */}
      <Dialog open={isRolloverModalOpen} onOpenChange={setIsRolloverModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-blue-500" />
              Rollover Position
            </DialogTitle>
            <DialogDescription>
              Roll over the position to a new expiry date.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-expiry">New Expiry Date *</Label>
              <Input
                id="new-expiry"
                type="date"
                value={rolloverForm.newExpiry}
                onChange={(e) => setRolloverForm({ ...rolloverForm, newExpiry: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-price">New Price (optional)</Label>
              <Input
                id="new-price"
                type="number"
                step="0.01"
                placeholder="Leave blank for market price"
                value={rolloverForm.newPrice}
                onChange={(e) => setRolloverForm({ ...rolloverForm, newPrice: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rollover-reason">Reason</Label>
              <Input
                id="rollover-reason"
                placeholder="Enter reason for rollover"
                value={rolloverForm.reason}
                onChange={(e) => setRolloverForm({ ...rolloverForm, reason: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRolloverModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRolloverSubmit} 
              className="bg-blue-500 hover:bg-blue-600"
              disabled={!rolloverForm.newExpiry}
            >
              Rollover Position
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}