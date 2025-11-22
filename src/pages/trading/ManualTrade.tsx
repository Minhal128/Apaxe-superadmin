import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Calendar, Download, List, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

export default function ManualTrade() {
  const [brokerage, setBrokerage] = useState('with')
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  const manualTradeData = [
    { 
      time: '21:46:47', 
      client: '#25345', 
      market: 'NSEOPT', 
      script: 'VT03(419261)', 
      bs: 'Market', 
      lot: '0.01', 
      qty: '2', 
      userIP: '1.00', 
      orderPrice: '149,704.000',
      netPrice: '149,700.6667',
      addedBy: '149,700.6667',
      cancel: true
    },
    { 
      time: '21:46:47', 
      client: '#25345', 
      market: 'NSEOPT', 
      script: 'VT03(419261)', 
      bs: 'Market', 
      lot: '0.01', 
      qty: '2', 
      userIP: '1.00', 
      orderPrice: '149,704.000',
      netPrice: '149,700.6667',
      addedBy: '149,700.6667',
      cancel: true
    },
    { 
      time: '21:46:47', 
      client: '#25345', 
      market: 'NSEOPT', 
      script: 'VT03(419261)', 
      bs: 'Market', 
      lot: '0.01', 
      qty: '2', 
      userIP: '1.00', 
      orderPrice: '149,704.000',
      netPrice: '149,700.6667',
      addedBy: '149,700.6667',
      cancel: true
    },
    { 
      time: '21:46:47', 
      client: '#25345', 
      market: 'NSEOPT', 
      script: 'VT03(419261)', 
      bs: 'Market', 
      lot: '0.01', 
      qty: '2', 
      userIP: '1.00', 
      orderPrice: '149,704.000',
      netPrice: '149,700.6667',
      addedBy: '149,700.6667',
      cancel: true
    },
  ]

  const toggleRow = (index: number) => {
    setExpandedRows(prev =>
      prev.includes(index)
        ? prev.filter(item => item !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Manual Trade</h1>
      </div>

      {/* Trade Form */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Trade date</Label>
            <div className="relative">
              <Input
                type="text"
                defaultValue="10/12/2025"
                className="pr-8 h-10"
              />
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Segment</Label>
            <Select defaultValue="">
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nse">NSE</SelectItem>
                <SelectItem value="mcx">MCX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Script</Label>
            <Select defaultValue="">
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="script">Script</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Lot</Label>
            <Select defaultValue="">
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-2 block">QTY</Label>
            <Select defaultValue="">
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Price</Label>
            <Select defaultValue="">
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-gray-600 mb-2 block">Client</Label>
            <Select defaultValue="">
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
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
            <Button className="bg-green-500 hover:bg-green-600 text-white h-10 flex-1 sm:flex-none">
              Buy
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white h-10 flex-1 sm:flex-none">
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
          </div>
          
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3 p-4">
            {manualTradeData.map((row, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
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
                      <span className="text-xs font-medium text-gray-500">B/S:</span>
                      <span className={`text-sm font-medium ${row.bs === 'Buy' ? 'text-green-600' : 'text-red-600'}`}>
                        {row.bs}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    {expandedRows.includes(index) ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                    <Trash2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-600" />
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
                        <span className="text-xs font-medium text-gray-500">QTY:</span>
                        <p className="text-sm text-gray-900">{row.qty}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">User IP:</span>
                        <p className="text-sm text-gray-900">{row.userIP}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Order Price:</span>
                        <p className="text-sm text-gray-900">{row.orderPrice}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Net Price:</span>
                        <p className="text-sm text-gray-900">{row.netPrice}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-xs font-medium text-gray-500">Added by:</span>
                        <p className="text-sm text-gray-900">{row.addedBy}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
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
                  <TableHead className="font-semibold text-gray-700 min-w-[80px]">B/S</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[60px]">Lot</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[60px]">QTY</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">User IP</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[120px]">Order Price</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[120px]">Net Price</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[120px]">Added by</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[80px]">Cancel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {manualTradeData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="text-xs sm:text-sm">{row.time}</TableCell>
                    <TableCell className="text-xs sm:text-sm font-medium">{row.client}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{row.market}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{row.script}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{row.bs}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{row.lot}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{row.qty}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{row.userIP}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{row.orderPrice}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{row.netPrice}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{row.addedBy}</TableCell>
                    <TableCell>
                      <Trash2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-600" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}