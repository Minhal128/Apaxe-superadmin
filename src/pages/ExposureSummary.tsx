import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Download, List, Grid3x3, Copy, File, ChevronDown, ChevronUp } from 'lucide-react'

export default function ExposureSummary() {
  const [showAllEntries, setShowAllEntries] = useState(false)
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  const exposureData = [
    { sn: 1, name: '25,278.00', cBill: '', vln: '25,278.00', cBillMTM: '0.64', bBro: '0.64', cHBroMT: '25,291.00', withoutB: '25,291.00', tBrok: '25,291.00', pMTM: '25,291.00', sPK: '100', dMTM: '0.00', upMTM: '100', sMTM: '100', qSt: '', nP: '' },
    { sn: 2, name: '25,278.00', cBill: '', vln: '25,278.00', cBillMTM: '0.64', bBro: '0.64', cHBroMT: '25,291.00', withoutB: '25,291.00', tBrok: '25,291.00', pMTM: '25,291.00', sPK: '100', dMTM: '0.00', upMTM: '100', sMTM: '100', qSt: '', nP: '' },
    { sn: 3, name: '25,278.00', cBill: '', vln: '25,278.00', cBillMTM: '0.64', bBro: '0.64', cHBroMT: '25,291.00', withoutB: '25,291.00', tBrok: '25,291.00', pMTM: '25,291.00', sPK: '100', dMTM: '0.00', upMTM: '100', sMTM: '100', qSt: '', nP: '' },
    { sn: 4, name: '25,278.00', cBill: '', vln: '25,278.00', cBillMTM: '0.64', bBro: '0.64', cHBroMT: '25,291.00', withoutB: '25,291.00', tBrok: '25,291.00', pMTM: '25,291.00', sPK: '100', dMTM: '0.00', upMTM: '100', sMTM: '100', qSt: '', nP: '' },
  ]

  const toggleRow = (sn: number) => {
    setExpandedRows(prev =>
      prev.includes(sn)
        ? prev.filter(item => item !== sn)
        : [...prev, sn]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Exposure Summary</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
              <Grid3x3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-wrap">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search"
              className="pl-9 h-10"
            />
          </div>
          
          <div className="grid grid-cols-2 sm:flex gap-3 w-full sm:w-auto">
            <Select defaultValue="">
              <SelectTrigger className="w-full sm:w-32 h-10">
                <SelectValue placeholder="Master" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nse">NSE</SelectItem>
                <SelectItem value="mcx">MCX</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="">
              <SelectTrigger className="w-full sm:w-32 h-10">
                <SelectValue placeholder="Market" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nse">NSE</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="">
              <SelectTrigger className="w-full sm:w-40 h-10">
                <SelectValue placeholder="Broker" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="script">Script name</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="">
              <SelectTrigger className="w-full sm:w-32 h-10">
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expiry">Expiry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <Button className="bg-gray-800 hover:bg-gray-900 text-white h-10 flex-1 sm:flex-none">
              Submit
            </Button>
            <Button variant="outline" className="h-10 flex-1 sm:flex-none">
              Reset
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showAllEntries}
              onChange={(e) => setShowAllEntries(e.target.checked)}
              className="rounded border-gray-300"
            />
            Show All entries
          </label>
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
            {exposureData.map((row) => (
              <div key={row.sn} className="bg-white border border-gray-200 rounded-lg p-4">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleRow(row.sn)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">S.N:</span>
                      <span className="text-sm font-medium text-gray-900">{row.sn}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">Name:</span>
                      <span className="text-sm text-gray-900">{row.name}</span>
                    </div>
                  </div>
                  <div>
                    {expandedRows.includes(row.sn) ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedRows.includes(row.sn) && (
                  <div className="mt-4 space-y-3 border-t pt-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs font-medium text-gray-500">VLN:</span>
                        <p className="text-sm text-gray-900">{row.vln}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">C-BILL MTM:</span>
                        <p className="text-sm text-gray-900">{row.cBillMTM}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">B.BRO:</span>
                        <p className="text-sm text-gray-900">{row.bBro}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">C+H BRO MT:</span>
                        <p className="text-sm text-gray-900">{row.cHBroMT}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">WITHOUT.B:</span>
                        <p className="text-sm text-gray-900">{row.withoutB}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">T.BROK:</span>
                        <p className="text-sm text-gray-900">{row.tBrok}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">P.MTM:</span>
                        <p className="text-sm text-gray-900">{row.pMTM}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">S.P %:</span>
                        <p className="text-sm text-gray-900">{row.sPK}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">D.MTM:</span>
                        <p className="text-sm text-gray-900">{row.dMTM}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">UP.MTM:</span>
                        <p className="text-sm text-gray-900">{row.upMTM}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">S.MTM:</span>
                        <p className="text-sm text-gray-900">{row.sMTM}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">C-BILL:</span>
                        <Copy className="w-4 h-4 text-gray-400 cursor-pointer" />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500">Q_ST:</span>
                          <File className="w-4 h-4 text-gray-400 cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500">N.P:</span>
                          <File className="w-4 h-4 text-gray-400 cursor-pointer" />
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
                  <TableHead className="font-semibold text-gray-700 min-w-[50px]">S.N ▼</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">Name</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">C-BILL</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">VLN</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[120px]">C-BILL MTM</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">B.BRO</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[130px]">C+H BRO MT</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[120px]">WITHOUT.B</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">T.BROK</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">P.MTM</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">S.P %</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">D.MTM</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">UP.MTM</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">S.MTM</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[80px]">Q_ST</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[80px]">N.P</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exposureData.map((row) => (
                  <TableRow key={row.sn} className="hover:bg-gray-50">
                    <TableCell>{row.sn}</TableCell>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>
                      <Copy className="w-4 h-4 text-gray-400 cursor-pointer" />
                    </TableCell>
                    <TableCell>{row.vln}</TableCell>
                    <TableCell>{row.cBillMTM}</TableCell>
                    <TableCell>{row.bBro}</TableCell>
                    <TableCell>{row.cHBroMT}</TableCell>
                    <TableCell>{row.withoutB}</TableCell>
                    <TableCell>{row.tBrok}</TableCell>
                    <TableCell>{row.pMTM}</TableCell>
                    <TableCell>{row.sPK}</TableCell>
                    <TableCell>{row.dMTM}</TableCell>
                    <TableCell>{row.upMTM}</TableCell>
                    <TableCell>{row.sMTM}</TableCell>
                    <TableCell>
                      <File className="w-4 h-4 text-gray-400 cursor-pointer" />
                    </TableCell>
                    <TableCell>
                      <File className="w-4 h-4 text-gray-400 cursor-pointer" />
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