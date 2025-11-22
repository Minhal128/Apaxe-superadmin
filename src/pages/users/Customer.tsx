import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Calendar, Download, List, Search } from 'lucide-react'

export default function Customer() {
  const customerData = [
    { 
      date: '09-10-2025',
      loginId: '161422',
      broker: '594534 (SAAHO RETURN',
      master: 'DEMO MST-01-Master (706730)',
      actions: ['E', 'L', 'RP', 'CL', 'A'],
      loginTime: '2025-06-06',
      loginIp: '103.215.156.14',
      joinTime: '2025-06-06'
    },
    { 
      date: '09-10-2025',
      loginId: '161422',
      broker: '594534 (SAAHO RETURN',
      master: 'DEMO MST-01-Master (706730)',
      actions: ['E', 'L', 'RP', 'CL', 'A'],
      loginTime: '2025-06-06',
      loginIp: '103.215.156.14',
      joinTime: '2025-06-06'
    },
    { 
      date: '09-10-2025',
      loginId: '161422',
      broker: '594534 (SAAHO RETURN',
      master: 'DEMO MST-01-Master (706730)',
      actions: ['E', 'L', 'RP', 'CL', 'A'],
      loginTime: '2025-06-06',
      loginIp: '103.215.156.14',
      joinTime: '2025-06-06'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Customer</h1>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search"
                className="pl-9 w-full h-9 sm:h-10"
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0 h-9 sm:h-10 w-9 sm:w-10">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Market</Label>
            <Select defaultValue="market">
              <SelectTrigger className="w-full bg-gray-100 text-xs sm:text-sm h-8 sm:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Broker</Label>
            <Select defaultValue="">
              <SelectTrigger className="w-full bg-gray-100 text-xs sm:text-sm h-8 sm:h-10">
                <SelectValue placeholder="Search" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="search">Search</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Join Before</Label>
            <div className="relative flex-1">
              <Input
                type="text"
                defaultValue="10/12/2025"
                className="w-full text-xs sm:text-sm h-8 sm:h-10 pr-8"
              />
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Join After</Label>
            <div className="relative flex-1">
              <Input
                type="text"
                defaultValue="10/12/2025"
                className="w-full text-xs sm:text-sm h-8 sm:h-10 pr-8"
              />
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Show All entries */}
      <div className="bg-white px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-600">Show All entries</span>
          <Button variant="outline" size="sm" className="h-6 w-6 p-0 min-w-6">
            <span className="text-xs">+</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <List className="w-4 h-4 text-gray-500 hover:text-gray-700" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="w-4 h-4 text-gray-500 hover:text-gray-700" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 md:p-6">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[800px] sm:min-w-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-xs sm:text-sm px-3 sm:px-4 py-2 font-semibold">Date</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-2 font-semibold">Login ID</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-2 font-semibold">Broker</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-2 font-semibold">Master</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-2 font-semibold">Action</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-2 font-semibold">Login Time</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-2 font-semibold">Login IP</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-2 font-semibold">Join Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerData.map((customer, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-xs sm:text-sm px-3 sm:px-4 py-2">
                        {customer.date}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                        {customer.loginId}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                        <span className="truncate block max-w-[120px] sm:max-w-none">
                          {customer.broker}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                        <span className="truncate block max-w-[140px] sm:max-w-none">
                          {customer.master}
                        </span>
                      </TableCell>
                      <TableCell className="px-2 sm:px-4 py-2">
                        <div className="flex items-center gap-1 flex-wrap">
                          {customer.actions.map((action, idx) => (
                            <Button
                              key={idx}
                              size="sm"
                              className="h-5 w-5 sm:h-6 sm:w-6 p-0 text-[10px] sm:text-xs bg-gray-600 hover:bg-gray-700 text-white min-w-5 sm:min-w-6"
                            >
                              {action}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                        {customer.loginTime}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                        <span className="font-mono text-[10px] sm:text-xs">
                          {customer.loginIp}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                        {customer.joinTime}
                      </TableCell>
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