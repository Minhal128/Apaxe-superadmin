import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Calendar, Download, List, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { useState } from 'react'

export default function CashLedgerLog() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  const toggleRow = (index: number) => {
    setExpandedRows(prev => 
      prev.includes(index) ? prev.filter(item => item !== index) : [...prev, index]
    )
  }

  const cashLedgerLogData = [
    { 
      client: '161422',
      oldAmount: '161422',
      newAmount: '161422',
      oldRemark: '161422',
      newRemark: '161422',
      logType: '11-10-2025, 16:PM',
      time: '11-10-2025, 16:PM',
      ip: '11-10-2025, 16:PM',
      editTime: '11-10-2025, 16:PM',
      addTime: '103.215.156.14'
    },
    { 
      client: '161422',
      oldAmount: '161422',
      newAmount: '161422',
      oldRemark: '161422',
      newRemark: '161422',
      logType: '11-10-2025, 16:PM',
      time: '11-10-2025, 16:PM',
      ip: '11-10-2025, 16:PM',
      editTime: '11-10-2025, 16:PM',
      addTime: '103.215.156.14'
    },
    { 
      client: '161422',
      oldAmount: '161422',
      newAmount: '161422',
      oldRemark: '161422',
      newRemark: '161422',
      logType: '11-10-2025, 16:PM',
      time: '11-10-2025, 16:PM',
      ip: '11-10-2025, 16:PM',
      editTime: '11-10-2025, 16:PM',
      addTime: '103.215.156.14'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-800">Cash Ledger Log</h1>
        <div className="w-full sm:w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search"
              className="pl-9 w-full"
            />
          </div>
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden sm:block bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">From</Label>
            <div className="relative">
              <Input
                type="text"
                defaultValue="10/12/2025"
                className="w-28 sm:w-32 pr-8"
              />
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">To</Label>
            <div className="relative">
              <Input
                type="text"
                defaultValue="10/12/2025"
                className="w-28 sm:w-32 pr-8"
              />
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Client</Label>
            <Select defaultValue="">
              <SelectTrigger className="w-28 sm:w-32 bg-gray-100">
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="bg-green-500 hover:bg-green-600 text-white ml-2">
            Submit
          </Button>
        </div>
      </div>

      {/* Mobile Filters Toggle */}
      <div className="sm:hidden bg-white border-b border-gray-200 px-4 py-3">
        <Button 
          variant="outline" 
          className="w-full justify-between"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        >
          <span>Filters</span>
          <ChevronDown className={`w-4 h-4 transform transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
        </Button>
        
        {/* Collapsible Filters for Mobile */}
        {isFiltersOpen && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 whitespace-nowrap min-w-16">From</Label>
                <div className="relative flex-1">
                  <Input
                    type="text"
                    defaultValue="10/12/2025"
                    className="pr-8 w-full"
                  />
                  <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 whitespace-nowrap min-w-16">To</Label>
                <div className="relative flex-1">
                  <Input
                    type="text"
                    defaultValue="10/12/2025"
                    className="pr-8 w-full"
                  />
                  <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 whitespace-nowrap min-w-16">Client</Label>
                <Select defaultValue="">
                  <SelectTrigger className="bg-gray-100 flex-1">
                    <SelectValue placeholder="Client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="bg-green-500 hover:bg-green-600 text-white w-full">
              Submit
            </Button>
          </div>
        )}
      </div>

      {/* Show All entries */}
      <div className="bg-white px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show All entries</span>
          <Button variant="outline" size="sm" className="h-6 w-6 p-0">
            <span className="text-xs">+</span>
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
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="min-w-[100px]">Client</TableHead>
                  <TableHead className="min-w-[120px]">Old Amount</TableHead>
                  <TableHead className="min-w-[120px]">New Amount</TableHead>
                  <TableHead className="min-w-[120px]">Old Remark</TableHead>
                  <TableHead className="min-w-[120px]">New Remark</TableHead>
                  <TableHead className="min-w-[150px]">Log Type</TableHead>
                  <TableHead className="min-w-[150px]">Time</TableHead>
                  <TableHead className="min-w-[120px]">IP</TableHead>
                  <TableHead className="min-w-[150px]">Edit Time</TableHead>
                  <TableHead className="min-w-[150px]">Add Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cashLedgerLogData.map((log, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{log.client}</TableCell>
                    <TableCell>{log.oldAmount}</TableCell>
                    <TableCell>{log.newAmount}</TableCell>
                    <TableCell>{log.oldRemark}</TableCell>
                    <TableCell>{log.newRemark}</TableCell>
                    <TableCell>{log.logType}</TableCell>
                    <TableCell>{log.time}</TableCell>
                    <TableCell className="font-mono text-xs">{log.ip}</TableCell>
                    <TableCell>{log.editTime}</TableCell>
                    <TableCell>{log.addTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {cashLedgerLogData.map((log, index) => (
              <Card key={index} className="m-4 overflow-hidden">
                {/* Header - Always Visible */}
                <div 
                  className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleRow(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Client: {log.client}</div>
                        <div className="text-sm text-gray-500">{log.logType}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Amount Change</div>
                        <div className="text-sm font-medium text-gray-900">
                          {log.oldAmount} → {log.newAmount}
                        </div>
                      </div>
                      {expandedRows.includes(index) ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expandable Content */}
                {expandedRows.includes(index) && (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">Client:</span>
                        <p className="text-gray-900 font-semibold">{log.client}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">Log Type:</span>
                        <p className="text-gray-900">{log.logType}</p>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <span className="font-medium text-gray-500">Amount Change:</span>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 text-center p-2 bg-red-50 rounded border">
                            <div className="text-xs text-gray-500">Old Amount</div>
                            <div className="font-semibold text-red-700">{log.oldAmount}</div>
                          </div>
                          <div className="text-gray-400">→</div>
                          <div className="flex-1 text-center p-2 bg-green-50 rounded border">
                            <div className="text-xs text-gray-500">New Amount</div>
                            <div className="font-semibold text-green-700">{log.newAmount}</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <span className="font-medium text-gray-500">Remark Change:</span>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 p-2 bg-gray-50 rounded border">
                            <div className="text-xs text-gray-500">Old Remark</div>
                            <div className="font-medium text-gray-900 truncate">{log.oldRemark}</div>
                          </div>
                          <div className="text-gray-400">→</div>
                          <div className="flex-1 p-2 bg-gray-50 rounded border">
                            <div className="text-xs text-gray-500">New Remark</div>
                            <div className="font-medium text-gray-900 truncate">{log.newRemark}</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">Time:</span>
                        <p className="text-gray-900 text-xs">{log.time}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">Edit Time:</span>
                        <p className="text-gray-900 text-xs">{log.editTime}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">Add Time:</span>
                        <p className="text-gray-900 text-xs">{log.addTime}</p>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <span className="font-medium text-gray-500">IP Address:</span>
                        <p className="text-gray-900 font-mono text-xs bg-gray-50 p-2 rounded border">
                          {log.ip}
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        Export
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {cashLedgerLogData.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">No cash ledger log data available</div>
              <div className="text-sm text-gray-500">Try adjusting your search filters</div>
            </div>
          )}
        </Card>

        {/* Pagination - Mobile Friendly */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="text-sm text-gray-600">
            Showing {cashLedgerLogData.length} log entries
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