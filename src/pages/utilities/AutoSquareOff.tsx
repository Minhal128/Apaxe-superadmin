import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Calendar, Download, Menu, Plus } from 'lucide-react'

export default function AutoSquareOff() {
  const autoSquareOffData = [
    { 
      client: '6A5d737',
      mtm: '20/10/2025',
      time: '103.215.156.14'
    },
    { 
      client: '6A5d738',
      mtm: '21/10/2025',
      time: '103.215.156.15'
    },
    { 
      client: '6A5d739',
      mtm: '22/10/2025',
      time: '103.215.156.16'
    },
    { 
      client: '6A5d740',
      mtm: '23/10/2025',
      time: '103.215.156.17'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Auto-square off</h1>
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
          <Menu className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
          <Download className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <Card className="overflow-hidden">
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3 p-4">
            {autoSquareOffData.map((log, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-500">Client:</span>
                    <span className="text-sm font-medium text-gray-900">{log.client}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-500">MTM:</span>
                    <span className="text-sm text-gray-900">{log.mtm}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-500">Time:</span>
                    <span className="text-sm text-gray-900">{log.time}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-3 mt-3 border-t border-gray-200">
                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs bg-red-50 text-red-600 border-red-200 hover:bg-red-100">
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 min-w-[120px]">Client</TableHead>
                  <TableHead className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 min-w-[120px]">MTM</TableHead>
                  <TableHead className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 min-w-[150px]">Time</TableHead>
                  <TableHead className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700 min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {autoSquareOffData.map((log, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900">{log.client}</TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{log.mtm}</TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{log.time}</TableCell>
                    <TableCell className="px-4 sm:px-6 py-4 text-xs sm:text-sm">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-7 px-3 text-xs">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 px-3 text-xs bg-red-50 text-red-600 border-red-200 hover:bg-red-100">
                          Delete
                        </Button>
                      </div>
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