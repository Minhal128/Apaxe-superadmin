import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Plus, Grid3x3, ChevronDown } from 'lucide-react'

export default function MarketWatch() {
  const [selectedMarket, setSelectedMarket] = useState('NSE')
  const [selectedScriptName, setSelectedScriptName] = useState('')
  const [selectedExpiry, setSelectedExpiry] = useState('')
  const [selectedCEPE, setSelectedCEPE] = useState('')
  const [selectedStrike, setSelectedStrike] = useState('')

  const marketData = [
    { symbol: 'NIFTY 500', bidRate: '25,278.00', askRate: '25,278.00', ltp: '25,278.00', change: '0.64', netChange: '0.64', high: '25,291.00', low: '25,291.00', open: '25,291.00', close: '25,291.00' },
    { symbol: 'BANKNIFTY', bidRate: '47,850.00', askRate: '47,852.00', ltp: '47,851.00', change: '0.52', netChange: '0.52', high: '47,900.00', low: '47,800.00', open: '47,820.00', close: '47,820.00' },
    { symbol: 'SENSEX', bidRate: '78,450.00', askRate: '78,455.00', ltp: '78,452.00', change: '0.38', netChange: '0.38', high: '78,500.00', low: '78,400.00', open: '78,420.00', close: '78,420.00' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Title, Search and Buttons */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          <h1 className="text-2xl font-semibold text-gray-900">Market Watch</h1>
          <div className="flex items-center gap-4">
            <div className="relative" style={{ width: '380px' }}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search"
                className="pl-10 h-10 bg-gray-50 border-gray-200 w-full"
              />
            </div>
            <Button className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 h-10">
              <Plus className="w-4 h-4 mr-2" />
              Add Script
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Grid3x3 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Row */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-4">
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="w-36 h-10 bg-white">
              <SelectValue placeholder="NSE" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NSE">NSE</SelectItem>
              <SelectItem value="MCX">MCX</SelectItem>
              <SelectItem value="BSE">BSE</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedScriptName} onValueChange={setSelectedScriptName}>
            <SelectTrigger className="w-36 h-10 bg-white">
              <SelectValue placeholder="Script" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nifty">NIFTY 500</SelectItem>
              <SelectItem value="banknifty">BANKNIFTY</SelectItem>
              <SelectItem value="sensex">SENSEX</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedExpiry} onValueChange={setSelectedExpiry}>
            <SelectTrigger className="w-36 h-10 bg-white">
              <SelectValue placeholder="Expiry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCEPE} onValueChange={setSelectedCEPE}>
            <SelectTrigger className="w-36 h-10 bg-white">
              <SelectValue placeholder="CE/PE" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ce">CE</SelectItem>
              <SelectItem value="pe">PE</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStrike} onValueChange={setSelectedStrike}>
            <SelectTrigger className="w-36 h-10 bg-white">
              <SelectValue placeholder="Strike" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25000">25000</SelectItem>
              <SelectItem value="25100">25100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Market Data Section */}
        <Card className="overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Live Market Data</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700 px-4 py-3">Symbol</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-4 py-3">Bid</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-4 py-3">Ask</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-4 py-3">LTP</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-4 py-3">Chg</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-4 py-3">Net Chg</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-4 py-3">High</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-4 py-3">Low</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-4 py-3">Open</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-4 py-3">Close</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium px-4 py-3">{row.symbol}</TableCell>
                    <TableCell className="px-4 py-3">{row.bidRate}</TableCell>
                    <TableCell className="px-4 py-3">{row.askRate}</TableCell>
                    <TableCell className="px-4 py-3">{row.ltp}</TableCell>
                    <TableCell className="px-4 py-3 text-green-600">{row.change}</TableCell>
                    <TableCell className="px-4 py-3 text-green-600">{row.netChange}</TableCell>
                    <TableCell className="px-4 py-3">{row.high}</TableCell>
                    <TableCell className="px-4 py-3">{row.low}</TableCell>
                    <TableCell className="px-4 py-3">{row.open}</TableCell>
                    <TableCell className="px-4 py-3">{row.close}</TableCell>
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
