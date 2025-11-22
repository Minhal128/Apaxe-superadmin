import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Calendar, Download, List, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export default function Broker() {
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  const brokerData = [
    { 
      date: '09-10-2025',
      loginId: '161422',
      p: '1',
      cCount: '0',
      master: 'DEMO MST-01-Master (706730)',
      actions: ['E', 'L', 'RP', 'CL', 'A'],
      loginTime: '2025-06-06',
      loginIp: '103.215.156.14',
      joinTime: '2025-06-06'
    },
    { 
      date: '09-10-2025',
      loginId: '161422',
      p: '1',
      cCount: '0',
      master: 'DEMO MST-01-Master (706730)',
      actions: ['E', 'L', 'RP', 'CL', 'A'],
      loginTime: '2025-06-06',
      loginIp: '103.215.156.14',
      joinTime: '2025-06-06'
    },
    { 
      date: '09-10-2025',
      loginId: '161422',
      p: '1',
      cCount: '0',
      master: 'DEMO MST-01-Master (706730)',
      actions: ['E', 'L', 'RP', 'CL', 'A'],
      loginTime: '2025-06-06',
      loginIp: '103.215.156.14',
      joinTime: '2025-06-06'
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
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Dealer</h1>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Search"
              className="w-full sm:w-64 h-10"
            />
            <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 min-w-[60px]">Market</Label>
              <Select defaultValue="market">
                <SelectTrigger className="w-full h-10 bg-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 min-w-[60px]">Broker</Label>
              <Select defaultValue="">
                <SelectTrigger className="w-full h-10 bg-gray-100">
                  <SelectValue placeholder="Search" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="search">Search</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 min-w-[80px]">Join Before</Label>
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
              <Label className="text-sm text-gray-600 min-w-[80px]">Join After</Label>
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
        </div>
      </div>

      {/* Show All entries */}
      <div className="bg-white px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-600">Show All entries</span>
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
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3 p-4">
            {brokerData.map((broker, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div 
                  className="flex justify-between items-start cursor-pointer"
                  onClick={() => toggleRow(index)}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-500">Date:</span>
                      <span className="text-sm font-medium text-gray-900">{broker.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-500">Login ID:</span>
                      <span className="text-sm text-gray-900">{broker.loginId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-500">P (%):</span>
                      <span className="text-sm text-gray-900">{broker.p}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-500">C. Count:</span>
                      <span className="text-sm text-gray-900">{broker.cCount}</span>
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
                    <div>
                      <span className="text-xs font-medium text-gray-500">Master:</span>
                      <p className="text-sm text-gray-900 mt-1">{broker.master}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs font-medium text-gray-500">Login Time:</span>
                        <p className="text-sm text-gray-900">{broker.loginTime}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Join Time:</span>
                        <p className="text-sm text-gray-900">{broker.joinTime}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">Login IP:</span>
                      <p className="text-sm text-gray-900">{broker.loginIp}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 mb-2 block">Actions:</span>
                      <div className="flex gap-1">
                        {broker.actions.map((action, idx) => (
                          <Button
                            key={idx}
                            size="sm"
                            className="h-7 w-7 p-0 text-xs bg-gray-600 hover:bg-gray-700 text-white flex-1"
                          >
                            {action}
                          </Button>
                        ))}
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
                  <TableHead className="min-w-[100px]">Name</TableHead>
                  <TableHead className="min-w-[100px]">Login ID</TableHead>
                  <TableHead className="min-w-[80px]">P (%)</TableHead>
                  <TableHead className="min-w-[100px]">C. Count</TableHead>
                  <TableHead className="min-w-[200px]">Master</TableHead>
                  <TableHead className="min-w-[180px]">Action</TableHead>
                  <TableHead className="min-w-[120px]">Login Time</TableHead>
                  <TableHead className="min-w-[120px]">Login IP</TableHead>
                  <TableHead className="min-w-[120px]">Join Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brokerData.map((broker, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-xs sm:text-sm">{broker.date}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{broker.loginId}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{broker.p}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{broker.cCount}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{broker.master}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {broker.actions.map((action, idx) => (
                          <Button
                            key={idx}
                            size="sm"
                            className="h-6 w-6 p-0 text-xs bg-gray-600 hover:bg-gray-700 text-white"
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">{broker.loginTime}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{broker.loginIp}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{broker.joinTime}</TableCell>
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