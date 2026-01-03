import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Download, Pencil, Trash2, Search, LogOut, RotateCcw, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { exportToExcel } from '@/lib/exportUtils'

export default function ForexPosition() {
  const [filterType, setFilterType] = useState('all')
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

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

  const [positionData, setPositionData] = useState([
    { 
      id: 1,
      checkbox: true,
      tradeby: 'Client', 
      time: '21:46:47', 
      date: '09-10-2025', 
      name: 'VT03(419261)', 
      market: 'Market', 
      symbol: 'SILVER 05DEC2025', 
      type: 'S', 
      lot: '1.00', 
      qty: '20', 
      modify: true, 
      cancel: true,
      orderPrice: '149,704.000',
      netPrice: '149,700.6667',
      status: 'Executed',
      ip: ''
    },
    { 
      id: 2,
      checkbox: true,
      tradeby: 'Client', 
      time: '21:46:47', 
      date: '09-10-2025', 
      name: 'VT03(419261)', 
      market: 'Market', 
      symbol: 'SILVER 05DEC2025', 
      type: 'S', 
      lot: '1.00', 
      qty: '20', 
      modify: true, 
      cancel: true,
      orderPrice: '149,704.000',
      netPrice: '149,700.6667',
      status: 'Executed',
      ip: ''
    },
    { 
      id: 3,
      checkbox: true,
      tradeby: 'Client', 
      time: '21:46:47', 
      date: '09-10-2025', 
      name: 'VT03(419261)', 
      market: 'Market', 
      symbol: 'SILVER 05DEC2025', 
      type: 'S', 
      lot: '1.00', 
      qty: '20', 
      modify: true, 
      cancel: true,
      orderPrice: '149,704.000',
      netPrice: '149,700.6667',
      status: 'Executed',
      ip: ''
    },
  ])

  // Select position handler
  const handleSelectPosition = (positionId: number) => {
    setSelectedPosition(prev => prev === positionId ? null : positionId)
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
      // Simulate API call
      setLoading(true)
      
      // In real implementation, call:
      // await forexApi.closePosition(selectedPosition, { ... })
      
      // For now, remove from local data
      setPositionData(prev => prev.filter(p => p.id !== selectedPosition))
      
      toast.success('Position exited successfully')
      setIsExitModalOpen(false)
      setSelectedPosition(null)
    } catch (error) {
      toast.error('Failed to exit position')
    } finally {
      setLoading(false)
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
      setLoading(true)
      
      // In real implementation, call API to close and reopen position
      // For demo, update the symbol with new expiry
      setPositionData(prev => prev.map(p => {
        if (p.id === selectedPosition) {
          const newExpiry = rolloverForm.newExpiry ? 
            new Date(rolloverForm.newExpiry).toLocaleDateString('en-US', { 
              day: '2-digit', month: 'short', year: 'numeric' 
            }).toUpperCase().replace(/,/g, '').replace(/ /g, '') : 
            'NEW_EXPIRY'
          return {
            ...p,
            symbol: p.symbol.replace(/\d{2}[A-Z]{3}\d{4}/, newExpiry)
          }
        }
        return p
      }))
      
      toast.success('Position rolled over successfully')
      setIsRolloverModalOpen(false)
      setSelectedPosition(null)
    } catch (error) {
      toast.error('Failed to rollover position')
    } finally {
      setLoading(false)
    }
  }

  // Get Position Handler (Refresh)
  const handleGetPosition = async () => {
    try {
      setLoading(true)
      toast.info('Fetching latest positions...')
      
      // In real implementation:
      // const response = await forexApi.getForexPositions({})
      // setPositionData(response.data)
      
      // Simulate refresh delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Positions refreshed successfully')
    } catch (error) {
      toast.error('Failed to fetch positions')
    } finally {
      setLoading(false)
    }
  }

  // Clear filter handler
  const handleClearFilter = () => {
    setFilterType('all')
    setSelectedPosition(null)
    toast.info('Filters cleared')
  }

  // Export handler
  const handleExport = () => {
    if (positionData.length === 0) {
      toast.warning('No data to export')
      return
    }

    const exportData = positionData.map((position) => ({
      client: position.name,
      market: position.market,
      symbol: position.symbol,
      type: position.type === 'S' ? 'Sell' : 'Buy',
      lot: position.lot,
      quantity: position.qty,
      orderPrice: position.orderPrice,
      netPrice: position.netPrice,
      status: position.status,
      date: position.date,
      time: position.time
    }))

    const columnMapping = {
      client: 'Client',
      market: 'Market',
      symbol: 'Symbol',
      type: 'Type',
      lot: 'Lot',
      quantity: 'Quantity',
      orderPrice: 'Order Price',
      netPrice: 'Net Price',
      status: 'Status',
      date: 'Date',
      time: 'Time'
    }

    exportToExcel(exportData, 'Forex_Positions', 'Positions', columnMapping)
    toast.success('Positions exported successfully')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Position report</h1>
          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search"
                className="pl-9 h-10"
              />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10" onClick={handleExport}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="space-y-4">
          {/* Radio Group */}
          <RadioGroup value={filterType} onValueChange={setFilterType} className="flex flex-wrap gap-3 sm:gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" className="border-green-500 text-green-500 w-4 h-4" />
              <Label htmlFor="all" className="text-xs sm:text-sm font-medium cursor-pointer">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="client-wise" id="client-wise" className="border-green-500 text-green-500 w-4 h-4" />
              <Label htmlFor="client-wise" className="text-xs sm:text-sm font-medium cursor-pointer">Client Wise</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="outstanding" id="outstanding" className="border-green-500 text-green-500 w-4 h-4" />
              <Label htmlFor="outstanding" className="text-xs sm:text-sm font-medium cursor-pointer">Outstanding</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="self-summary" id="self-summary" className="border-green-500 text-green-500 w-4 h-4" />
              <Label htmlFor="self-summary" className="text-xs sm:text-sm font-medium cursor-pointer">Self-summary</Label>
            </div>
          </RadioGroup>

          {/* Filter Selects */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Market</Label>
              <Select defaultValue="market">
                <SelectTrigger className="w-full sm:w-32 bg-gray-100 text-xs sm:text-sm h-8 sm:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Script</Label>
              <Select defaultValue="">
                <SelectTrigger className="w-full sm:w-40 bg-gray-100 text-xs sm:text-sm h-8 sm:h-10">
                  <SelectValue placeholder="Script" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="script">Script</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Client</Label>
              <Select defaultValue="">
                <SelectTrigger className="w-full sm:w-32 bg-gray-100 text-xs sm:text-sm h-8 sm:h-10">
                  <SelectValue placeholder="Client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Broker</Label>
              <Select defaultValue="">
                <SelectTrigger className="w-full sm:w-32 bg-gray-100 text-xs sm:text-sm h-8 sm:h-10">
                  <SelectValue placeholder="Broker" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="broker">Broker</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Expiry</Label>
              <Select defaultValue="">
                <SelectTrigger className="w-full sm:w-32 bg-gray-100 text-xs sm:text-sm h-8 sm:h-10">
                  <SelectValue placeholder="Expiry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expiry">Expiry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Master</Label>
              <Select defaultValue="">
                <SelectTrigger className="w-full sm:w-32 bg-gray-100 text-xs sm:text-sm h-8 sm:h-10">
                  <SelectValue placeholder="Master" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="master">Master</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-gray-50 rounded-lg px-3 sm:px-4 py-2 text-center sm:text-left">
            <div className="text-xs text-gray-500">Total MTM</div>
            <div className="text-sm sm:text-lg font-semibold">0.00</div>
          </div>
          <div className="bg-gray-50 rounded-lg px-3 sm:px-4 py-2 text-center sm:text-left">
            <div className="text-xs text-gray-500">Sell MTM</div>
            <div className="text-sm sm:text-lg font-semibold">0.00</div>
          </div>
          <div className="bg-gray-50 rounded-lg px-3 sm:px-4 py-2 text-center sm:text-left">
            <div className="text-xs text-gray-500">Downline MTM</div>
            <div className="text-sm sm:text-lg font-semibold">0.00</div>
          </div>
          <div className="bg-gray-50 rounded-lg px-3 sm:px-4 py-2 text-center sm:text-left">
            <div className="text-xs text-gray-500">BUY QTY</div>
            <div className="text-sm sm:text-lg font-semibold">0.00</div>
          </div>
          <div className="bg-gray-50 rounded-lg px-3 sm:px-4 py-2 text-center sm:text-left">
            <div className="text-xs text-gray-500">SELL QTY</div>
            <div className="text-sm sm:text-lg font-semibold">0.00</div>
          </div>
          <div className="bg-gray-50 rounded-lg px-3 sm:px-4 py-2 text-center sm:text-left">
            <div className="text-xs text-gray-500">TOTAL QTY</div>
            <div className="text-sm sm:text-lg font-semibold">0.00</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
          <Button variant="outline" size="sm" className="text-xs h-8 sm:h-9 flex-1 sm:flex-none" onClick={handleClearFilter}>
            Clear filter
          </Button>
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white text-xs h-8 sm:h-9 flex-1 sm:flex-none"
            onClick={handleExitPosition}
            disabled={loading}
          >
            <LogOut className="w-3 h-3 mr-1" />
            Exit position
          </Button>
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white text-xs h-8 sm:h-9 flex-1 sm:flex-none"
            onClick={handleRollover}
            disabled={loading}
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Rollover
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8 sm:h-9 flex-1 sm:flex-none"
            onClick={handleGetPosition}
            disabled={loading}
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Get position
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 md:p-6">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1200px] sm:min-w-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-8 sm:w-12 text-xs sm:text-sm px-2 sm:px-4">D</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4">Trade by</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4">Time</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4">Date</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4">Name</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4">Market</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4">Symbol</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4">Type</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4">Lot</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4">QTY</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4">Modify</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4">Cancel</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4">Order Price</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4">Net P</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4">Status</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4">IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positionData.map((position) => (
                    <TableRow 
                      key={position.id} 
                      className={`hover:bg-gray-50 cursor-pointer ${selectedPosition === position.id ? 'bg-blue-50' : ''}`}
                      onClick={() => handleSelectPosition(position.id)}
                    >
                      <TableCell className="px-2 sm:px-4">
                        <input 
                          type="radio" 
                          name="position" 
                          className="w-3 h-3 sm:w-4 sm:h-4"
                          checked={selectedPosition === position.id}
                          onChange={() => handleSelectPosition(position.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-xs sm:text-sm px-2 sm:px-4">{position.tradeby}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4">{position.time}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4">{position.date}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4">{position.name}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4">{position.market}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4">{position.symbol}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4">{position.type}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4">{position.lot}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4">{position.qty}</TableCell>
                      <TableCell className="px-2 sm:px-4">
                        <Pencil className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
                      </TableCell>
                      <TableCell className="px-2 sm:px-4">
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 cursor-pointer hover:text-red-600" />
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4">{position.orderPrice}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4">{position.netPrice}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4">{position.status}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4">{position.ip}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
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
              Close the selected forex position. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedPosition && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Selected Position:</p>
                <p className="font-medium">{positionData.find(p => p.id === selectedPosition)?.symbol}</p>
                <p className="text-sm text-gray-500">{positionData.find(p => p.id === selectedPosition)?.name}</p>
              </div>
            )}
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
            <Button onClick={handleExitSubmit} className="bg-green-500 hover:bg-green-600" disabled={loading}>
              {loading ? 'Processing...' : 'Exit Position'}
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
              Roll over the forex position to a new expiry date.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedPosition && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Selected Position:</p>
                <p className="font-medium">{positionData.find(p => p.id === selectedPosition)?.symbol}</p>
                <p className="text-sm text-gray-500">{positionData.find(p => p.id === selectedPosition)?.name}</p>
              </div>
            )}
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
              disabled={!rolloverForm.newExpiry || loading}
            >
              {loading ? 'Processing...' : 'Rollover Position'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}