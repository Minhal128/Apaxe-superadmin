import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Download, List, Grid3x3, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

export default function Position() {
  const [filterType, setFilterType] = useState('all')
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  const toggleRow = (id: number) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const positionData = [
    { 
      id: 1, 
      tradeBy: 'Client', 
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
      netP: '149,700.6667',
      status: 'Executed',
      ip: '149,700.6667'
    },
    { 
      id: 2, 
      tradeBy: 'Client', 
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
      netP: '149,700.6667',
      status: 'Executed',
      ip: '149,700.6667'
    },
    { 
      id: 3, 
      tradeBy: 'Client', 
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
      netP: '149,700.6667',
      status: 'Executed',
      ip: '149,700.6667'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Position report</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="shrink-0">
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
              <span className="ml-2 font-semibold">0.00</span>
            </div>
            <div>
              <span className="text-gray-600">Sell MTM</span>
              <span className="ml-2 font-semibold">0.00</span>
            </div>
            <div>
              <span className="text-gray-600">Downline MTM</span>
              <span className="ml-2 font-semibold">0.00</span>
            </div>
            <div>
              <span className="text-gray-600">BUY QTY</span>
              <span className="ml-2 font-semibold">0.00</span>
            </div>
            <div>
              <span className="text-gray-600">SELL QTY</span>
              <span className="ml-2 font-semibold">0.00</span>
            </div>
            <div>
              <span className="text-gray-600">TOTAL QTY</span>
              <span className="ml-2 font-semibold">0.00</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="text-xs">Clear filter</Button>
            <Button className="bg-green-500 hover:bg-green-600 text-white text-xs">Exit position</Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white text-xs">Rollover</Button>
            <Button className="bg-gray-800 hover:bg-gray-900 text-white text-xs">Get position</Button>
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
                <span className="ml-1 font-semibold">0.00</span>
              </div>
              <div>
                <span className="text-gray-600">Sell MTM:</span>
                <span className="ml-1 font-semibold">0.00</span>
              </div>
              <div>
                <span className="text-gray-600">Downline MTM:</span>
                <span className="ml-1 font-semibold">0.00</span>
              </div>
              <div>
                <span className="text-gray-600">BUY QTY:</span>
                <span className="ml-1 font-semibold">0.00</span>
              </div>
              <div>
                <span className="text-gray-600">SELL QTY:</span>
                <span className="ml-1 font-semibold">0.00</span>
              </div>
              <div>
                <span className="text-gray-600">TOTAL QTY:</span>
                <span className="ml-1 font-semibold">0.00</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 border-t pt-3">
              <Button variant="outline" size="sm" className="text-xs">Clear filter</Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white text-xs">Exit position</Button>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white text-xs">Rollover</Button>
              <Button className="bg-gray-800 hover:bg-gray-900 text-white text-xs">Get position</Button>
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
              <Download className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
            </div>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700 min-w-[50px]">D ▼</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">Trade by</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[80px]">Time</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">Date</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[120px]">Name</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">Market</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[150px]">Symbol</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[60px]">Type</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[60px]">Lot</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[60px]">QTY</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[80px]">Modify</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[80px]">Cancel</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[120px]">Order Price</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[120px]">Net P</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positionData.map((row) => (
                  <TableRow key={row.id} className="hover:bg-gray-50">
                    <TableCell>
                      <input type="radio" name="position" className="rounded-full" />
                    </TableCell>
                    <TableCell className="font-medium">{row.tradeBy}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.market}</TableCell>
                    <TableCell>{row.symbol}</TableCell>
                    <TableCell>
                      <Badge className={`${
                        row.type === 'S' 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}>
                        {row.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{row.lot}</TableCell>
                    <TableCell>{row.qty}</TableCell>
                    <TableCell>
                      <Pencil className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-700" />
                    </TableCell>
                    <TableCell>
                      <Trash2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-600" />
                    </TableCell>
                    <TableCell>{row.orderPrice}</TableCell>
                    <TableCell>{row.netP}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{row.ip}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {positionData.map((row) => (
              <Card key={row.id} className="m-4 overflow-hidden">
                {/* Header - Always Visible */}
                <div 
                  className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleRow(row.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input type="radio" name="position" className="rounded-full" />
                      <div>
                        <div className="font-semibold text-gray-900">{row.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span>{row.symbol}</span>
                          <Badge className={`text-xs ${
                            row.type === 'S' 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {row.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        {row.status}
                      </Badge>
                      {expandedRows.includes(row.id) ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expandable Content */}
                {expandedRows.includes(row.id) && (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">Trade By:</span>
                        <p className="text-gray-900">{row.tradeBy}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">Date & Time:</span>
                        <p className="text-gray-900">{row.date} {row.time}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">Market:</span>
                        <p className="text-gray-900">{row.market}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">Lot:</span>
                        <p className="text-gray-900">{row.lot}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">Quantity:</span>
                        <p className="text-gray-900 font-semibold">{row.qty}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">Order Price:</span>
                        <p className="text-gray-900 font-semibold">{row.orderPrice}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">Net P:</span>
                        <p className="text-gray-900 font-semibold">{row.netP}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">IP:</span>
                        <p className="text-gray-900 text-xs">{row.ip}</p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        <Pencil className="w-3 h-3 mr-1" />
                        Modify
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs text-red-600 hover:text-red-700">
                        <Trash2 className="w-3 h-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {positionData.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">No position data available</div>
              <div className="text-sm text-gray-500">Try adjusting your search filters</div>
            </div>
          )}
        </Card>

        {/* Pagination - Mobile Friendly */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="text-sm text-gray-600">
            Showing {positionData.length} positions
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="outline" size="sm" disabled className="text-xs">
              Previous
            </Button>
            <Button variant="outline" size="sm" className="text-xs bg-gray-100">
              1
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              2
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}