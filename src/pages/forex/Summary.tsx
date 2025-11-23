import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Download, List, File, ChevronDown, ChevronUp, Copy, Search } from 'lucide-react'
import { useState } from 'react'

export default function ForexSummary() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  const toggleRow = (index: number) => {
    setExpandedRows(prev => 
      prev.includes(index) ? prev.filter(item => item !== index) : [...prev, index]
    )
  }

  const summaryData = [
    { 
      sn: '1', 
      name: '25,278.00', 
      all: '25,278.00',
      outstanding: '0.64',
      totalMtm: '0.64',
      netMtm: '25,291.00',
      brokerBrok: '25,291.00',
      brokerMtm: '25,291.00',
      downlineMtm: '25,291.00',
      uplineMtm: '0.00',
      selfMtm: '',
      copy: true
    },
    { 
      sn: '2', 
      name: '25,278.00', 
      all: '25,278.00',
      outstanding: '0.64',
      totalMtm: '0.64',
      netMtm: '25,291.00',
      brokerBrok: '25,291.00',
      brokerMtm: '25,291.00',
      downlineMtm: '25,291.00',
      uplineMtm: '0.00',
      selfMtm: '',
      copy: true
    },
    { 
      sn: '3', 
      name: '25,278.00', 
      all: '25,278.00',
      outstanding: '0.64',
      totalMtm: '0.64',
      netMtm: '25,291.00',
      brokerBrok: '25,291.00',
      brokerMtm: '25,291.00',
      downlineMtm: '25,291.00',
      uplineMtm: '0.00',
      selfMtm: '',
      copy: true
    },
    { 
      sn: '4', 
      name: '25,278.00', 
      all: '25,278.00',
      outstanding: '0.64',
      totalMtm: '0.64',
      netMtm: '25,291.00',
      brokerBrok: '25,291.00',
      brokerMtm: '25,291.00',
      downlineMtm: '25,291.00',
      uplineMtm: '0.00',
      selfMtm: '',
      copy: true
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-gray-800">Summary</h1>
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

      {/* Desktop Filters */}
      <div className="hidden sm:block bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Market</Label>
            <Select defaultValue="nse">
              <SelectTrigger className="w-28 sm:w-32 bg-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nse">NSE</SelectItem>
                <SelectItem value="mcx">MCX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Script name</Label>
            <Select defaultValue="">
              <SelectTrigger className="w-32 sm:w-40 bg-gray-100">
                <SelectValue placeholder="Script name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="script">Script</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Valan</Label>
            <Select defaultValue="">
              <SelectTrigger className="w-28 sm:w-32 bg-gray-100">
                <SelectValue placeholder="Expiry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expiry">Expiry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Master</Label>
            <Select defaultValue="">
              <SelectTrigger className="w-28 sm:w-32 bg-gray-100">
                <SelectValue placeholder="CE/PE" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ce">CE</SelectItem>
                <SelectItem value="pe">PE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Broker</Label>
            <Select defaultValue="">
              <SelectTrigger className="w-28 sm:w-32 bg-gray-100">
                <SelectValue placeholder="Strike" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strike">Strike</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Client</Label>
            <Select defaultValue="">
              <SelectTrigger className="w-28 sm:w-32 bg-gray-100">
                <SelectValue placeholder="Strike" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strike">Strike</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="bg-green-500 hover:bg-green-600 text-white">
            Submit
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
                <Label className="text-sm text-gray-600 whitespace-nowrap min-w-20">Market</Label>
                <Select defaultValue="nse">
                  <SelectTrigger className="bg-gray-100 flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nse">NSE</SelectItem>
                    <SelectItem value="mcx">MCX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 whitespace-nowrap min-w-20">Script name</Label>
                <Select defaultValue="">
                  <SelectTrigger className="bg-gray-100 flex-1">
                    <SelectValue placeholder="Script name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="script">Script</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 whitespace-nowrap min-w-20">Valan</Label>
                <Select defaultValue="">
                  <SelectTrigger className="bg-gray-100 flex-1">
                    <SelectValue placeholder="Expiry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expiry">Expiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 whitespace-nowrap min-w-20">Master</Label>
                <Select defaultValue="">
                  <SelectTrigger className="bg-gray-100 flex-1">
                    <SelectValue placeholder="CE/PE" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ce">CE</SelectItem>
                    <SelectItem value="pe">PE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 whitespace-nowrap min-w-20">Broker</Label>
                <Select defaultValue="">
                  <SelectTrigger className="bg-gray-100 flex-1">
                    <SelectValue placeholder="Strike" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strike">Strike</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 whitespace-nowrap min-w-20">Client</Label>
                <Select defaultValue="">
                  <SelectTrigger className="bg-gray-100 flex-1">
                    <SelectValue placeholder="Strike" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strike">Strike</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button className="bg-green-500 hover:bg-green-600 text-white flex-1">
                Submit
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
                  <TableHead className="min-w-[60px]">S.N</TableHead>
                  <TableHead className="min-w-[100px]">Name</TableHead>
                  <TableHead className="min-w-[100px]">ALL</TableHead>
                  <TableHead className="min-w-[120px]">OUTSTANDING</TableHead>
                  <TableHead className="min-w-[120px]">TOTAL.MTM</TableHead>
                  <TableHead className="min-w-[100px]">NET MTM</TableHead>
                  <TableHead className="min-w-[120px]">BROKER BROK</TableHead>
                  <TableHead className="min-w-[120px]">BROKER MTM</TableHead>
                  <TableHead className="min-w-[120px]">DOWNLINE MTM</TableHead>
                  <TableHead className="min-w-[120px]">UPLINE MTM</TableHead>
                  <TableHead className="min-w-[100px]">SELF_MTM</TableHead>
                  <TableHead className="min-w-[80px]">N.P</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summaryData.map((item, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell>{item.sn}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {item.name}
                        {item.copy && (
                          <Copy className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{item.all}</TableCell>
                    <TableCell>{item.outstanding}</TableCell>
                    <TableCell>{item.totalMtm}</TableCell>
                    <TableCell>{item.netMtm}</TableCell>
                    <TableCell>{item.brokerBrok}</TableCell>
                    <TableCell>{item.brokerMtm}</TableCell>
                    <TableCell>{item.downlineMtm}</TableCell>
                    <TableCell>{item.uplineMtm}</TableCell>
                    <TableCell>{item.selfMtm || '-'}</TableCell>
                    <TableCell>
                      <File className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {summaryData.map((item, index) => (
              <Card key={index} className="m-4 overflow-hidden">
                {/* Header - Always Visible */}
                <div 
                  className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleRow(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">{item.sn}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          {item.name}
                          {item.copy && (
                            <Copy className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">Net MTM: {item.netMtm}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
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
                        <span className="font-medium text-gray-500">ALL:</span>
                        <p className="text-gray-900 font-semibold">{item.all}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">OUTSTANDING:</span>
                        <p className="text-gray-900 font-semibold">{item.outstanding}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">TOTAL MTM:</span>
                        <p className="text-gray-900 font-semibold">{item.totalMtm}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">BROKER BROK:</span>
                        <p className="text-gray-900 font-semibold">{item.brokerBrok}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">BROKER MTM:</span>
                        <p className="text-gray-900 font-semibold">{item.brokerMtm}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">DOWNLINE MTM:</span>
                        <p className="text-gray-900 font-semibold">{item.downlineMtm}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">UPLINE MTM:</span>
                        <p className="text-gray-900 font-semibold">{item.uplineMtm}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">SELF MTM:</span>
                        <p className="text-gray-900 font-semibold">{item.selfMtm || '-'}</p>
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
          {summaryData.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">No summary data available</div>
              <div className="text-sm text-gray-500">Try adjusting your search filters</div>
            </div>
          )}
        </Card>

        {/* Pagination - Mobile Friendly */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Showing {summaryData.length} entries
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