import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export default function ForexMarginManagement() {
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  const marginData = [
    { 
      name: 'DEMO MST-01 (706730) (M', 
      nsefutAmount: '2,000,000',
      nsefutLot: '0',
      mcxfutAmount: '0',
      mcxfutLot: '0',
      nseoptAmount: '0',
      nseoptLot: '0',
      totalAmount: '2,000,000',
      totalLot: '0'
    },
    { 
      name: 'DEMO MST-01 (706730) (M', 
      nsefutAmount: '2,000,000',
      nsefutLot: '0',
      mcxfutAmount: '0',
      mcxfutLot: '0',
      nseoptAmount: '0',
      nseoptLot: '0',
      totalAmount: '2,000,000',
      totalLot: '0'
    },
    { 
      name: 'DEMO MST-01 (706730) (M', 
      nsefutAmount: '2,000,000',
      nsefutLot: '0',
      mcxfutAmount: '0',
      mcxfutLot: '0',
      nseoptAmount: '0',
      nseoptLot: '0',
      totalAmount: '2,000,000',
      totalLot: '0'
    },
    { 
      name: 'DEMO MST-01 (706730) (M', 
      nsefutAmount: '2,000,000',
      nsefutLot: '0',
      mcxfutAmount: '0',
      mcxfutLot: '0',
      nseoptAmount: '0',
      nseoptLot: '0',
      totalAmount: '2,000,000',
      totalLot: '0'
    },
    { 
      name: 'DEMO MST-01 (706730) (M', 
      nsefutAmount: '2,000,000',
      nsefutLot: '0',
      mcxfutAmount: '0',
      mcxfutLot: '0',
      nseoptAmount: '0',
      nseoptLot: '0',
      totalAmount: '2,000,000',
      totalLot: '0'
    },
    { 
      name: 'DEMO MST-01 (706730) (M', 
      nsefutAmount: '2,000,000',
      nsefutLot: '0',
      mcxfutAmount: '0',
      mcxfutLot: '0',
      nseoptAmount: '0',
      nseoptLot: '0',
      totalAmount: '2,000,000',
      totalLot: '0'
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
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Margin Management</h1>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 min-w-[50px]">Client</Label>
              <Select defaultValue="">
                <SelectTrigger className="w-full sm:w-32 h-10 bg-gray-100">
                  <SelectValue placeholder="Expiry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expiry">Expiry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 min-w-[50px]">Broker</Label>
              <Select defaultValue="">
                <SelectTrigger className="w-full sm:w-32 h-10 bg-gray-100">
                  <SelectValue placeholder="Expiry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expiry">Expiry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 min-w-[50px]">Master</Label>
              <Select defaultValue="">
                <SelectTrigger className="w-full sm:w-32 h-10 bg-gray-100">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="master">Master</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="bg-green-500 hover:bg-green-600 text-white h-10 w-full sm:w-auto mt-2 sm:mt-0">
            Search
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <Card className="overflow-hidden">
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3 p-4">
            {marginData.map((item, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleRow(index)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">Name:</span>
                      <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">Total:</span>
                      <span className="text-sm text-gray-900">{item.totalAmount} / {item.totalLot} lots</span>
                    </div>
                  </div>
                  <div>
                    {expandedRows.includes(index) ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedRows.includes(index) && (
                  <div className="mt-4 space-y-4 border-t pt-4">
                    {/* NSEFUT Section */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="text-xs font-semibold text-blue-800 mb-2">NSEFUT</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs text-blue-600">Amount:</span>
                          <p className="text-sm font-medium text-blue-900">{item.nsefutAmount}</p>
                        </div>
                        <div>
                          <span className="text-xs text-blue-600">Lot:</span>
                          <p className="text-sm font-medium text-blue-900">{item.nsefutLot}</p>
                        </div>
                      </div>
                    </div>

                    {/* MCXFUT Section */}
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="text-xs font-semibold text-green-800 mb-2">MCXFUT</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs text-green-600">Amount:</span>
                          <p className="text-sm font-medium text-green-900">{item.mcxfutAmount}</p>
                        </div>
                        <div>
                          <span className="text-xs text-green-600">Lot:</span>
                          <p className="text-sm font-medium text-green-900">{item.mcxfutLot}</p>
                        </div>
                      </div>
                    </div>

                    {/* NSEOPT Section */}
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h4 className="text-xs font-semibold text-purple-800 mb-2">NSEOPT</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs text-purple-600">Amount:</span>
                          <p className="text-sm font-medium text-purple-900">{item.nseoptAmount}</p>
                        </div>
                        <div>
                          <span className="text-xs text-purple-600">Lot:</span>
                          <p className="text-sm font-medium text-purple-900">{item.nseoptLot}</p>
                        </div>
                      </div>
                    </div>

                    {/* TOTAL Section */}
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <h4 className="text-xs font-semibold text-orange-800 mb-2">TOTAL</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs text-orange-600">Amount:</span>
                          <p className="text-sm font-medium text-orange-900">{item.totalAmount}</p>
                        </div>
                        <div>
                          <span className="text-xs text-orange-600">Lot:</span>
                          <p className="text-sm font-medium text-orange-900">{item.totalLot}</p>
                        </div>
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
                  <TableHead rowSpan={2} className="border-r border-gray-200 min-w-[200px]">Name</TableHead>
                  <TableHead colSpan={2} className="text-center border-r border-gray-200 bg-blue-50">NSEFUT</TableHead>
                  <TableHead colSpan={2} className="text-center border-r border-gray-200 bg-green-50">MCXFUT</TableHead>
                  <TableHead colSpan={2} className="text-center border-r border-gray-200 bg-purple-50">NSEOPT</TableHead>
                  <TableHead colSpan={2} className="text-center bg-orange-50">TOTAL</TableHead>
                </TableRow>
                <TableRow className="bg-gray-50">
                  <TableHead className="border-r border-gray-200 bg-blue-50 min-w-[120px]">Amount</TableHead>
                  <TableHead className="border-r border-gray-200 bg-blue-50 min-w-[80px]">Lot</TableHead>
                  <TableHead className="border-r border-gray-200 bg-green-50 min-w-[120px]">Amount</TableHead>
                  <TableHead className="border-r border-gray-200 bg-green-50 min-w-[80px]">Lot</TableHead>
                  <TableHead className="border-r border-gray-200 bg-purple-50 min-w-[120px]">Amount</TableHead>
                  <TableHead className="border-r border-gray-200 bg-purple-50 min-w-[80px]">Lot</TableHead>
                  <TableHead className="border-r border-gray-200 bg-orange-50 min-w-[120px]">Amount</TableHead>
                  <TableHead className="bg-orange-50 min-w-[80px]">Lot</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marginData.map((item, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium border-r border-gray-200">{item.name}</TableCell>
                    <TableCell className="border-r border-gray-200">{item.nsefutAmount}</TableCell>
                    <TableCell className="border-r border-gray-200">{item.nsefutLot}</TableCell>
                    <TableCell className="border-r border-gray-200">{item.mcxfutAmount}</TableCell>
                    <TableCell className="border-r border-gray-200">{item.mcxfutLot}</TableCell>
                    <TableCell className="border-r border-gray-200">{item.nseoptAmount}</TableCell>
                    <TableCell className="border-r border-gray-200">{item.nseoptLot}</TableCell>
                    <TableCell className="border-r border-gray-200">{item.totalAmount}</TableCell>
                    <TableCell>{item.totalLot}</TableCell>
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