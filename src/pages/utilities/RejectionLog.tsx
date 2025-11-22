import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Calendar, Download, List, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export default function RejectionLog() {
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  const rejectionLogData = [
    { 
      action: '09-10-2025',
      client: '161422',
      symbol: '161422',
      orderType: 'DEMO MST-01-Master (706730)',
      lot: '0.01',
      qty: '3',
      orderPrice: '103.215.156.14',
      message: 'John Khura',
      orderTime: '20/10/2025',
      userIp: '103.215.156.14'
    },
    { 
      action: '09-10-2025',
      client: '161422',
      symbol: '161422',
      orderType: 'DEMO MST-01-Master (706730)',
      lot: '0.01',
      qty: '3',
      orderPrice: '103.215.156.14',
      message: 'John Khura',
      orderTime: '20/10/2025',
      userIp: '103.215.156.14'
    },
    { 
      action: '09-10-2025',
      client: '161422',
      symbol: '161422',
      orderType: 'DEMO MST-01-Master (706730)',
      lot: '0.01',
      qty: '3',
      orderPrice: '103.215.156.14',
      message: 'John Khura',
      orderTime: '20/10/2025',
      userIp: '103.215.156.14'
    },
    { 
      action: '09-10-2025',
      client: '161422',
      symbol: '161422',
      orderType: 'DEMO MST-01-Master (706730)',
      lot: '0.01',
      qty: '3',
      orderPrice: '103.215.156.14',
      message: 'John Khura',
      orderTime: '20/10/2025',
      userIp: '103.215.156.14'
    },
    { 
      action: '09-10-2025',
      client: '161422',
      symbol: '161422',
      orderType: 'DEMO MST-01-Master (706730)',
      lot: '0.01',
      qty: '3',
      orderPrice: '103.215.156.14',
      message: 'John Khura',
      orderTime: '20/10/2025',
      userIp: '103.215.156.14'
    },
    { 
      action: '09-10-2025',
      client: '161422',
      symbol: '161422',
      orderType: 'DEMO MST-01-Master (706730)',
      lot: '0.01',
      qty: '3',
      orderPrice: '103.215.156.14',
      message: 'John Khura',
      orderTime: '20/10/2025',
      userIp: '103.215.156.14'
    },
    { 
      action: '09-10-2025',
      client: '161422',
      symbol: '161422',
      orderType: 'DEMO MST-01-Master (706730)',
      lot: '0.01',
      qty: '3',
      orderPrice: '103.215.156.14',
      message: 'John Khura',
      orderTime: '20/10/2025',
      userIp: '103.215.156.14'
    },
    { 
      action: '09-10-2025',
      client: '161422',
      symbol: '161422',
      orderType: 'DEMO MST-01-Master (706730)',
      lot: '0.01',
      qty: '3',
      orderPrice: '103.215.156.14',
      message: 'John Khura',
      orderTime: '20/10/2025',
      userIp: '103.215.156.14'
    },
    { 
      action: '09-10-2025',
      client: '161422',
      symbol: '161422',
      orderType: 'DEMO MST-01-Master (706730)',
      lot: '0.01',
      qty: '3',
      orderPrice: '103.215.156.14',
      message: 'John Khura',
      orderTime: '20/10/2025',
      userIp: '103.215.156.14'
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Rejection Log</h1>
          <Input
            type="text"
            placeholder="Search"
            className="w-full sm:w-64 h-10"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Date Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 min-w-[40px]">From</Label>
              <div className="relative flex-1">
                <Input
                  type="text"
                  defaultValue="10/12/2025"
                  className="w-full h-10 pr-8"
                />
                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 min-w-[40px]">To</Label>
              <div className="relative flex-1">
                <Input
                  type="text"
                  defaultValue="10/12/2025"
                  className="w-full h-10 pr-8"
                />
                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Filter Selects */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 min-w-[50px]">Client</Label>
              <Select defaultValue="">
                <SelectTrigger className="w-full h-10 bg-gray-100">
                  <SelectValue placeholder="Client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 min-w-[60px]">Segment</Label>
              <Select defaultValue="">
                <SelectTrigger className="w-full h-10 bg-gray-100">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="segment">Segment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 min-w-[90px]">Script name</Label>
              <Select defaultValue="">
                <SelectTrigger className="w-full h-10 bg-gray-100">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="script">Script</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full sm:w-auto">
            <Button className="bg-green-500 hover:bg-green-600 text-white h-10 flex-1 sm:flex-none">
              Search
            </Button>
            <Button variant="outline" className="h-10 flex-1 sm:flex-none">
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Show All entries */}
      <div className="bg-white px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-600">Show All entries</span>
          <Button variant="outline" size="sm" className="h-6 w-6 p-0">
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <List className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
          <Download className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <Card className="overflow-hidden">
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3 p-4">
            {rejectionLogData.map((log, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div 
                  className="flex justify-between items-start cursor-pointer"
                  onClick={() => toggleRow(index)}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-500">Action:</span>
                      <span className="text-sm font-medium text-gray-900">{log.action}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-500">Client:</span>
                      <span className="text-sm text-gray-900">{log.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-500">Symbol:</span>
                      <span className="text-sm text-gray-900">{log.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-500">Order Type:</span>
                      <span className="text-sm text-gray-900 truncate max-w-[120px]">{log.orderType}</span>
                    </div>
                  </div>
                  <div className="ml-4">
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
                        <span className="text-xs font-medium text-gray-500">Lot:</span>
                        <p className="text-sm text-gray-900">{log.lot}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">QTY:</span>
                        <p className="text-sm text-gray-900">{log.qty}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Order Price:</span>
                        <p className="text-sm text-gray-900">{log.orderPrice}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Order Time:</span>
                        <p className="text-sm text-gray-900">{log.orderTime}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">Message:</span>
                      <p className="text-sm text-gray-900 mt-1 bg-yellow-50 p-2 rounded border border-yellow-200">
                        {log.message}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">User IP:</span>
                      <p className="text-sm text-gray-900">{log.userIp}</p>
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
                  <TableHead className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 min-w-[100px]">Action</TableHead>
                  <TableHead className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 min-w-[100px]">Client</TableHead>
                  <TableHead className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 min-w-[100px]">Symbol</TableHead>
                  <TableHead className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 min-w-[150px]">Order Type</TableHead>
                  <TableHead className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 min-w-[80px]">Lot</TableHead>
                  <TableHead className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 min-w-[80px]">QTY</TableHead>
                  <TableHead className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 min-w-[120px]">Order price</TableHead>
                  <TableHead className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 min-w-[150px]">Message</TableHead>
                  <TableHead className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 min-w-[120px]">Order Time</TableHead>
                  <TableHead className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 min-w-[120px]">User IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rejectionLogData.map((log, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900">{log.action}</TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{log.client}</TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{log.symbol}</TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{log.orderType}</TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{log.lot}</TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{log.qty}</TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{log.orderPrice}</TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-xs sm:text-sm">
                      <div className="bg-yellow-50 border border-yellow-200 rounded px-2 py-1">
                        {log.message}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{log.orderTime}</TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{log.userIp}</TableCell>
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