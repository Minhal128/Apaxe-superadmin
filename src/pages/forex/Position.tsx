import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Download, Pencil, Trash2, Search } from 'lucide-react'
import { useState } from 'react'

export default function ForexPosition() {
  const [filterType, setFilterType] = useState('all')

  const positionData = [
    { 
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
  ]

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
            <Button variant="outline" size="icon" className="h-10 w-10">
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
          <Button variant="outline" size="sm" className="text-xs h-8 sm:h-9 flex-1 sm:flex-none">
            Clear filter
          </Button>
          <Button className="bg-green-500 hover:bg-green-600 text-white text-xs h-8 sm:h-9 flex-1 sm:flex-none">
            Exit position
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white text-xs h-8 sm:h-9 flex-1 sm:flex-none">
            Rollover
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-8 sm:h-9 flex-1 sm:flex-none">
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
                  {positionData.map((position, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="px-2 sm:px-4">
                        <input type="radio" name="position" className="w-3 h-3 sm:w-4 sm:h-4" />
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
    </div>
  )
}