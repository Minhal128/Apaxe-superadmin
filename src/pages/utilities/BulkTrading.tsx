import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Download, List, Search } from 'lucide-react'

export default function BulkTrading() {
  const bulkTradingData = [
    { 
      script: '6A5d737',
      noOfTrades: '20/10/2025',
      startTime: '20/10/2025',
      endTime: '103.215.156.14'
    },
    { 
      script: '6A5d737',
      noOfTrades: '20/10/2025',
      startTime: '20/10/2025',
      endTime: '103.215.156.14'
    },
    { 
      script: '6A5d737',
      noOfTrades: '20/10/2025',
      startTime: '20/10/2025',
      endTime: '103.215.156.14'
    },
    { 
      script: '6A5d737',
      noOfTrades: '20/10/2025',
      startTime: '20/10/2025',
      endTime: '103.215.156.14'
    },
    { 
      script: '6A5d737',
      noOfTrades: '20/10/2025',
      startTime: '20/10/2025',
      endTime: '103.215.156.14'
    },
    { 
      script: '6A5d737',
      noOfTrades: '20/10/2025',
      startTime: '20/10/2025',
      endTime: '103.215.156.14'
    },
    { 
      script: '6A5d737',
      noOfTrades: '20/10/2025',
      startTime: '20/10/2025',
      endTime: '103.215.156.14'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Bulk trading</h1>
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search"
              className="pl-9 w-full h-9 sm:h-10 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Number of trades</Label>
            <Input
              type="text"
              placeholder="Enter number"
              className="w-full sm:w-48 text-sm h-9 sm:h-10"
            />
          </div>

          <Button className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto h-9 sm:h-10 text-sm">
            Submit
          </Button>
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
            <div className="min-w-[600px] sm:min-w-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-xs sm:text-sm px-3 sm:px-4 py-2 font-semibold">Script</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-2 font-semibold">No of Trades</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-2 font-semibold">Start Time</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-2 font-semibold">End Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bulkTradingData.map((log, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-xs sm:text-sm px-3 sm:px-4 py-2">
                        <span className="font-mono">{log.script}</span>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                        {log.noOfTrades}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                        {log.startTime}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                        <span className="font-mono text-[10px] sm:text-xs">
                          {log.endTime}
                        </span>
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