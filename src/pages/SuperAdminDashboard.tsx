import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Plus, Grid3x3, ChevronDown } from 'lucide-react'

export default function SuperAdminDashboard() {
  const [selectedMarket, setSelectedMarket] = useState('NSE')
  const [selectedScriptName, setSelectedScriptName] = useState('')
  const [selectedExpiry, setSelectedExpiry] = useState('')
  const [selectedCEPE, setSelectedCEPE] = useState('')
  const [selectedStrike, setSelectedStrike] = useState('')

  const nseData = [
    { symbol: 'NIFTY 500', bidRate: '25,278.00', askRate: '25,278.00', ltp: '25,278.00', change: '0.64', netChange: '0.64', high: '25,291.00', low: '25,291.00', open: '25,291.00', close: '25,291.00' },
    { symbol: 'NIFTY 500', bidRate: '25,278.00', askRate: '25,278.00', ltp: '25,278.00', change: '0.64', netChange: '0.64', high: '25,291.00', low: '25,291.00', open: '25,291.00', close: '25,291.00' },
  ]

  const mcxData = [
    { symbol: 'NIFTY 500', bidRate: '25,278.00', askRate: '25,278.00', ltp: '25,278.00', change: '0.64', netChange: '0.64', high: '25,291.00', low: '25,291.00', open: '25,291.00', close: '25,291.00' },
    { symbol: 'NIFTY 500', bidRate: '25,278.00', askRate: '25,278.00', ltp: '25,278.00', change: '0.64', netChange: '0.64', high: '25,291.00', low: '25,291.00', open: '25,291.00', close: '25,291.00' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Dashboard</h1>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Button className="bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm flex-1 sm:flex-none">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Add new expiry</span>
              <span className="xs:hidden">Expiry</span>
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm flex-1 sm:flex-none">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Add all scripts</span>
              <span className="xs:hidden">Scripts</span>
            </Button>
            <Button variant="outline" size="icon" className="shrink-0">
              <Grid3x3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search"
              className="pl-9 w-full"
            />
          </div>
          
          <div className="grid grid-cols-2 sm:flex gap-3 sm:gap-4 w-full sm:w-auto">
            <Select value={selectedMarket} onValueChange={setSelectedMarket}>
              <SelectTrigger className="w-full text-xs sm:text-sm h-9 sm:h-10">
                <SelectValue placeholder="Market" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NSE">NSE</SelectItem>
                <SelectItem value="MCX">MCX</SelectItem>
                <SelectItem value="BSE">BSE</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedScriptName} onValueChange={setSelectedScriptName}>
              <SelectTrigger className="w-full text-xs sm:text-sm h-9 sm:h-10">
                <SelectValue placeholder="Script" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nifty">NIFTY 500</SelectItem>
                <SelectItem value="banknifty">BANKNIFTY</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedExpiry} onValueChange={setSelectedExpiry}>
              <SelectTrigger className="w-full text-xs sm:text-sm h-9 sm:h-10">
                <SelectValue placeholder="Expiry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCEPE} onValueChange={setSelectedCEPE}>
              <SelectTrigger className="w-full text-xs sm:text-sm h-9 sm:h-10">
                <SelectValue placeholder="CE/PE" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ce">CE</SelectItem>
                <SelectItem value="pe">PE</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStrike} onValueChange={setSelectedStrike}>
              <SelectTrigger className="w-full text-xs sm:text-sm h-9 sm:h-10">
                <SelectValue placeholder="Strike" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25000">25000</SelectItem>
                <SelectItem value="25100">25100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* NSE Section */}
        <Card className="overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700 text-sm sm:text-base">NSE</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[800px] sm:min-w-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm px-2 sm:px-4 py-2">Symbol</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm px-2 sm:px-4 py-2">Bid</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm px-2 sm:px-4 py-2">Ask</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm px-2 sm:px-4 py-2">LTP</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm px-2 sm:px-4 py-2">Chg</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm px-2 sm:px-4 py-2">Net Chg</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm px-2 sm:px-4 py-2">High</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm px-2 sm:px-4 py-2">Low</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm px-2 sm:px-4 py-2">Open</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm px-2 sm:px-4 py-2">Close</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nseData.map((row, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-xs sm:text-sm px-2 sm:px-4 py-2">{row.symbol}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">{row.bidRate}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">{row.askRate}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">{row.ltp}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">{row.change}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">{row.netChange}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">{row.high}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">{row.low}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">{row.open}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">{row.close}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>

        {/* MCX Section */}
        <Card className="overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700 text-sm sm:text-base">MCX</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[800px] sm:min-w-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm px-2 sm:px-4 py-2">Symbol</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm px-2 sm:px-4 py-2">Bid</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm px-2 sm:px-4 py-2">Ask</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm px-2 sm:px-4 py-2">LTP</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm px-2 sm:px-4 py-2">Chg</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm px-2 sm:px-4 py-2">Net Chg</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm px-2 sm:px-4 py-2">High</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm px-2 sm:px-4 py-2">Low</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm px-2 sm:px-4 py-2">Open</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm px-2 sm:px-4 py-2">Close</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mcxData.map((row, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-xs sm:text-sm px-2 sm:px-4 py-2">{row.symbol}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">{row.bidRate}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">{row.askRate}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">{row.ltp}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">{row.change}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">{row.netChange}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">{row.high}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">{row.low}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">{row.open}</TableCell>
                      <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">{row.close}</TableCell>
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