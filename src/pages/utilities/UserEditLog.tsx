import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Calendar, Download, List, ChevronDown, ChevronUp, Search, FileText } from 'lucide-react'
import { useState } from 'react'

export default function UserEditLog() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  const toggleRow = (index: number) => {
    setExpandedRows(prev => 
      prev.includes(index) ? prev.filter(item => item !== index) : [...prev, index]
    )
  }

  const userEditLogData = [
    { 
      client: '161422',
      changeLogs: 'User profile updated - Email changed from old@email.com to new@email.com',
      time: '11-10-2025, 16:45 PM',
      userIp: '103.215.156.14',
      changes: [
        { field: 'Email', oldValue: 'old@email.com', newValue: 'new@email.com' },
        { field: 'Phone', oldValue: '+1234567890', newValue: '+1987654321' }
      ]
    },
    { 
      client: '161423',
      changeLogs: 'Password reset and security settings updated',
      time: '11-10-2025, 14:30 PM',
      userIp: '103.215.156.15',
      changes: [
        { field: 'Password', oldValue: '********', newValue: '********' },
        { field: '2FA', oldValue: 'Disabled', newValue: 'Enabled' }
      ]
    },
    { 
      client: '161424',
      changeLogs: 'User permissions modified',
      time: '11-10-2025, 12:15 PM',
      userIp: '103.215.156.16',
      changes: [
        { field: 'Role', oldValue: 'User', newValue: 'Admin' },
        { field: 'Permissions', oldValue: 'Read-only', newValue: 'Read-Write' }
      ]
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-800">User Edit logs</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search logs..."
              className="pl-9 w-full"
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden sm:block bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Segment</Label>
            <Select defaultValue="segment">
              <SelectTrigger className="w-28 sm:w-32 bg-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="segment">Segment</SelectItem>
                <SelectItem value="forex">Forex</SelectItem>
                <SelectItem value="stocks">Stocks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Script name</Label>
            <Select defaultValue="">
              <SelectTrigger className="w-28 sm:w-32 bg-gray-100">
                <SelectValue placeholder="Search" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="search">Search</SelectItem>
                <SelectItem value="nifty">NIFTY</SelectItem>
                <SelectItem value="banknifty">BANKNIFTY</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Client</Label>
            <Select defaultValue="">
              <SelectTrigger className="w-28 sm:w-32 bg-gray-100">
                <SelectValue placeholder="Search" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="search">Search</SelectItem>
                <SelectItem value="client1">Client 1</SelectItem>
                <SelectItem value="client2">Client 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Join Before</Label>
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
            <Label className="text-sm text-gray-600 whitespace-nowrap">Join After</Label>
            <div className="relative">
              <Input
                type="text"
                defaultValue="10/12/2025"
                className="w-28 sm:w-32 pr-8"
              />
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <Button className="bg-green-500 hover:bg-green-600 text-white ml-2">
            Apply Filters
          </Button>
          <Button variant="outline">
            Reset
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
                <Label className="text-sm text-gray-600 whitespace-nowrap min-w-20">Segment</Label>
                <Select defaultValue="segment">
                  <SelectTrigger className="bg-gray-100 flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="segment">Segment</SelectItem>
                    <SelectItem value="forex">Forex</SelectItem>
                    <SelectItem value="stocks">Stocks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 whitespace-nowrap min-w-20">Script name</Label>
                <Select defaultValue="">
                  <SelectTrigger className="bg-gray-100 flex-1">
                    <SelectValue placeholder="Search" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="search">Search</SelectItem>
                    <SelectItem value="nifty">NIFTY</SelectItem>
                    <SelectItem value="banknifty">BANKNIFTY</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 whitespace-nowrap min-w-20">Client</Label>
                <Select defaultValue="" className="flex-1">
                  <SelectTrigger className="bg-gray-100">
                    <SelectValue placeholder="Search" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="search">Search</SelectItem>
                    <SelectItem value="client1">Client 1</SelectItem>
                    <SelectItem value="client2">Client 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 whitespace-nowrap min-w-20">Join Before</Label>
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
                <Label className="text-sm text-gray-600 whitespace-nowrap min-w-20">Join After</Label>
                <div className="relative flex-1">
                  <Input
                    type="text"
                    defaultValue="10/12/2025"
                    className="pr-8 w-full"
                  />
                  <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="bg-green-500 hover:bg-green-600 text-white flex-1">
                Apply Filters
              </Button>
              <Button variant="outline" className="flex-1">
                Reset
              </Button>
            </div>
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
                  <TableHead className="min-w-[300px]">Change logs</TableHead>
                  <TableHead className="min-w-[150px]">Time</TableHead>
                  <TableHead className="min-w-[120px]">User IP</TableHead>
                  <TableHead className="min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userEditLogData.map((log, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{log.client}</TableCell>
                    <TableCell>
                      <div className="max-w-[300px]">
                        <div className="font-medium text-gray-900 text-sm mb-1">
                          {log.changeLogs}
                        </div>
                        <div className="text-xs text-gray-500 space-y-1">
                          {log.changes.map((change, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="font-medium">{change.field}:</span>
                              <span className="text-red-600 line-through">{change.oldValue}</span>
                              <span>→</span>
                              <span className="text-green-600 font-semibold">{change.newValue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{log.time}</TableCell>
                    <TableCell className="font-mono text-xs bg-gray-50 px-2 py-1 rounded">
                      {log.userIp}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {userEditLogData.map((log, index) => (
              <Card key={index} className="m-4 overflow-hidden">
                {/* Header - Always Visible */}
                <div 
                  className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleRow(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Client: {log.client}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{log.changeLogs}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-xs text-gray-500">{log.time.split(',')[0]}</div>
                        <div className="text-xs text-gray-400">{log.time.split(',')[1]}</div>
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
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <span className="font-medium text-gray-500">Client ID:</span>
                          <p className="text-gray-900 font-semibold">{log.client}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="font-medium text-gray-500">Time:</span>
                          <p className="text-gray-900">{log.time}</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">Change Description:</span>
                        <p className="text-gray-900 text-sm bg-gray-50 p-3 rounded border">
                          {log.changeLogs}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <span className="font-medium text-gray-500">Detailed Changes:</span>
                        <div className="space-y-2">
                          {log.changes.map((change, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded border text-sm">
                              <span className="font-medium text-gray-700">{change.field}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-red-600 line-through text-xs">{change.oldValue}</span>
                                <span className="text-gray-400">→</span>
                                <span className="text-green-600 font-semibold text-xs">{change.newValue}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">IP Address:</span>
                        <p className="text-gray-900 font-mono text-xs bg-gray-100 p-2 rounded border">
                          {log.userIp}
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        Full Details
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {userEditLogData.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">No user edit logs available</div>
              <div className="text-sm text-gray-500">Try adjusting your search filters</div>
            </div>
          )}
        </Card>

        {/* Pagination - Mobile Friendly */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="text-sm text-gray-600">
            Showing {userEditLogData.length} log entries
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