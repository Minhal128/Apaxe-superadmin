import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Calendar, Download, List, Grid3x3, Pencil, Trash2, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react'

export default function Trades() {
  const [showAllEntries, setShowAllEntries] = useState(false)
  const [selectedTab, setSelectedTab] = useState('orders')
  const [isMobile, setIsMobile] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [expandedTrade, setExpandedTrade] = useState<number | null>(null)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const tradesData = [
    { 
      id: 1, 
      tradeBy: 'Client', 
      time: '21:46:47', 
      date: '09-10-2025', 
      name: 'VT03(419261)', 
      market: 'Market', 
      symbol: 'SILVER 05DEC2025', 
      type: 'S', 
      lot: '1.00', 
      qty: '20', 
      modify: true,
      cancel: true,
      orderPrice: '149,704.000',
      netP: '149,700.6667',
      status: 'Executed',
      ip: '192.168.1.1'
    },
    { 
      id: 2, 
      tradeBy: 'Client', 
      time: '21:46:47', 
      date: '09-10-2025', 
      name: 'VT03(419261)', 
      market: 'Market', 
      symbol: 'SILVER 05DEC2025', 
      type: 'S', 
      lot: '1.00', 
      qty: '20', 
      modify: true,
      cancel: true,
      orderPrice: '149,704.000',
      netP: '149,700.6667',
      status: 'Executed',
      ip: '192.168.1.2'
    },
    { 
      id: 3, 
      tradeBy: 'Client', 
      time: '21:46:47', 
      date: '09-10-2025', 
      name: 'VT03(419261)', 
      market: 'Market', 
      symbol: 'SILVER 05DEC2025', 
      type: 'S', 
      lot: '1.00', 
      qty: '20', 
      modify: true,
      cancel: true,
      orderPrice: '149,704.000',
      netP: '149,700.6667',
      status: 'Executed',
      ip: '192.168.1.3'
    },
  ]

  const MobileTradeCard = ({ trade }: { trade: typeof tradesData[0] }) => (
    <Card key={trade.id} className="p-4 mb-4">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input 
              type="radio" 
              name="trade" 
              className="rounded-full w-4 h-4" 
            />
            <div>
              <div className="font-medium text-sm">{trade.name}</div>
              <div className="text-xs text-gray-500">{trade.date} • {trade.time}</div>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
            {trade.status}
          </Badge>
        </div>

        {/* Trade Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500 text-xs">Trade By</span>
            <div className="font-medium">{trade.tradeBy}</div>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Market</span>
            <div className="font-medium">{trade.market}</div>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Symbol</span>
            <div className="font-medium">{trade.symbol}</div>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Type</span>
            <Badge className="bg-blue-100 text-blue-700 text-xs">{trade.type}</Badge>
          </div>
        </div>

        {/* Expandable Details */}
        {expandedTrade === trade.id && (
          <div className="border-t pt-3 space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-gray-500 text-xs">Lot</span>
                <div className="font-medium">{trade.lot}</div>
              </div>
              <div>
                <span className="text-gray-500 text-xs">QTY</span>
                <div className="font-medium">{trade.qty}</div>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Order Price</span>
                <div className="font-medium">{trade.orderPrice}</div>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Net Price</span>
                <div className="font-medium">{trade.netP}</div>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 text-xs">IP Address</span>
                <div className="font-medium">{trade.ip}</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4">
            <button 
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm"
              onClick={() => setExpandedTrade(expandedTrade === trade.id ? null : trade.id)}
            >
              {expandedTrade === trade.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Details
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-gray-700">
              <Pencil className="w-4 h-4" />
            </button>
            <button className="text-gray-400 hover:text-red-600">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Trades</h1>
          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search trades..."
                className="pl-9 h-10"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden h-10 w-10"
            >
              <Filter className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="hidden md:flex h-10 w-10">
              <Grid3x3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tab and Filters */}
      <div className={`bg-white border-b border-gray-200 px-4 md:px-6 py-4 ${isMobile && !showFilters ? 'hidden' : 'block'}`}>
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-4 flex-wrap mb-4">
          <Select value={selectedTab} onValueChange={setSelectedTab}>
            <SelectTrigger className="w-full md:w-32">
              <SelectValue placeholder="Orders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="orders">Orders</SelectItem>
              <SelectItem value="trades">Trades</SelectItem>
            </SelectContent>
          </Select>

          <div className="grid grid-cols-1 md:flex md:items-center gap-4 md:gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Trade after</span>
              <div className="relative flex-1">
                <Input
                  type="text"
                  defaultValue="10/12/2025"
                  className="w-full md:w-32 pr-8"
                />
                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Trade before</span>
              <div className="relative flex-1">
                <Input
                  type="text"
                  defaultValue="10/12/2025"
                  className="w-full md:w-32 pr-8"
                />
                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:flex md:items-center gap-4 md:gap-2">
            <Select defaultValue="">
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Market" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="">
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Script" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="script">Script name</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="">
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expiry">Expiry</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
      <div className="p-4 md:p-6">
        <Card className="overflow-hidden">
          <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-2">
              <List className="w-4 h-4 text-gray-500" />
              <Download className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
            </div>
            {isMobile && (
              <div className="text-sm text-gray-600">
                {tradesData.length} trades
              </div>
            )}
          </div>
          
          {isMobile ? (
            // Mobile View
            <div className="p-4">
              {tradesData.map((trade) => (
                <MobileTradeCard key={trade.id} trade={trade} />
              ))}
            </div>
          ) : (
            // Desktop View
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 min-w-[50px]">D ▼</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[100px]">Trade by</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[80px]">Time</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[100px]">Date</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[120px]">Name</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[100px]">Market</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[150px]">Symbol</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[60px]">Type</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[60px]">Lot</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[60px]">QTY</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[80px]">Modify</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[80px]">Cancel</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[120px]">Order Price</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[120px]">Net P</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[100px]">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[100px]">IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tradesData.map((row) => (
                    <TableRow key={row.id} className="hover:bg-gray-50">
                      <TableCell>
                        <input type="radio" name="trade" className="rounded-full" />
                      </TableCell>
                      <TableCell className="font-medium">{row.tradeBy}</TableCell>
                      <TableCell>{row.time}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.market}</TableCell>
                      <TableCell>{row.symbol}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">{row.type}</Badge>
                      </TableCell>
                      <TableCell>{row.lot}</TableCell>
                      <TableCell>{row.qty}</TableCell>
                      <TableCell>
                        <Pencil className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-700" />
                      </TableCell>
                      <TableCell>
                        <Trash2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-600" />
                      </TableCell>
                      <TableCell>{row.orderPrice}</TableCell>
                      <TableCell>{row.netP}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>{row.ip}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}