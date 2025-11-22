import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Calendar, Download, List, Pencil, Trash2, Menu, Search } from 'lucide-react'
import { useState } from 'react'

export default function ForexTrade() {
  const [isMobile, setIsMobile] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Check screen size on component mount and resize
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
      setIsMobile(window.innerWidth < 768)
    })
    
    // Initial check
    if (window.innerWidth < 768 && !isMobile) {
      setIsMobile(true)
    }
  }

  const tradeData = [
    { 
      checkbox: true,
      tradeby: 'Client', 
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
      netPrice: '149,700.6667',
      status: 'Executed',
      ip: ''
    },
    { 
      checkbox: true,
      tradeby: 'Client', 
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
      netPrice: '149,700.6667',
      status: 'Executed',
      ip: ''
    },
    { 
      checkbox: true,
      tradeby: 'Client', 
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
      netPrice: '149,700.6667',
      status: 'Executed',
      ip: ''
    },
  ]

  // Mobile trade card component
  type Trade = {
    checkbox: boolean;
    tradeby: string;
    time: string;
    date: string;
    name: string;
    market: string;
    symbol: string;
    type: string;
    lot: string;
    qty: string;
    modify: boolean;
    cancel: boolean;
    orderPrice: string;
    netPrice: string;
    status: string;
    ip: string;
  };

  interface MobileTradeCardProps {
    trade: Trade;
    index: number;
  }

  const MobileTradeCard = ({ trade, index }: MobileTradeCardProps) => (
    <Card key={index} className="p-4 mb-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input type="radio" name="trade" className="w-4 h-4" />
            <span className="font-medium text-sm">{trade.name}</span>
          </div>
          <span className={`px-2 py-1 rounded text-xs ${
            trade.status === 'Executed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {trade.status}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Trade by:</span>
            <span className="ml-2 font-medium">{trade.tradeby}</span>
          </div>
          <div>
            <span className="text-gray-500">Time:</span>
            <span className="ml-2 font-medium">{trade.time}</span>
          </div>
          <div>
            <span className="text-gray-500">Date:</span>
            <span className="ml-2 font-medium">{trade.date}</span>
          </div>
          <div>
            <span className="text-gray-500">Market:</span>
            <span className="ml-2 font-medium">{trade.market}</span>
          </div>
          <div>
            <span className="text-gray-500">Symbol:</span>
            <span className="ml-2 font-medium">{trade.symbol}</span>
          </div>
          <div>
            <span className="text-gray-500">Type:</span>
            <span className="ml-2 font-medium">{trade.type}</span>
          </div>
          <div>
            <span className="text-gray-500">Lot:</span>
            <span className="ml-2 font-medium">{trade.lot}</span>
          </div>
          <div>
            <span className="text-gray-500">QTY:</span>
            <span className="ml-2 font-medium">{trade.qty}</span>
          </div>
          <div>
            <span className="text-gray-500">Order Price:</span>
            <span className="ml-2 font-medium">{trade.orderPrice}</span>
          </div>
          <div>
            <span className="text-gray-500">Net Price:</span>
            <span className="ml-2 font-medium">{trade.netPrice}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
              <Pencil className="w-4 h-4" />
              <span className="text-sm">Modify</span>
            </button>
            <button className="flex items-center gap-1 text-gray-500 hover:text-red-600">
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">Cancel</span>
            </button>
          </div>
          {trade.ip && (
            <span className="text-xs text-gray-500">IP: {trade.ip}</span>
          )}
        </div>
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-xl font-semibold text-gray-800">Trades</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search"
              className="w-32 md:w-64 pl-8 md:pl-3"
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 md:hidden" />
          </div>
          <Button variant="outline" size="icon" className="hidden md:flex">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className={`bg-white border-b border-gray-200 px-4 md:px-6 py-4 ${isMobile && !showFilters ? 'hidden' : 'block'}`}>
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Select defaultValue="orders">
              <SelectTrigger className="w-full md:w-32 bg-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="orders">Orders</SelectItem>
                <SelectItem value="trades">Trades</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:flex md:items-center gap-4 md:gap-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 whitespace-nowrap">Trade after</Label>
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
              <Label className="text-sm text-gray-600 whitespace-nowrap">Trade before</Label>
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
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 whitespace-nowrap">Market</Label>
              <Select defaultValue="market">
                <SelectTrigger className="w-full md:w-32 bg-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 whitespace-nowrap">Script</Label>
              <Select defaultValue="">
                <SelectTrigger className="w-full md:w-40 bg-gray-100">
                  <SelectValue placeholder="Script name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="script">Script</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 whitespace-nowrap">Client</Label>
              <Select defaultValue="">
                <SelectTrigger className="w-full md:w-32 bg-gray-100">
                  <SelectValue placeholder="Expiry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expiry">Expiry</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Show All entries */}
      <div className="bg-white px-4 md:px-6 py-3 flex items-center justify-between">
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
      <div className="p-4 md:p-6">
        <Card className="overflow-hidden">
          {isMobile ? (
            // Mobile View - Cards
            <div className="p-4 space-y-4">
              {tradeData.map((trade, index) => (
                <MobileTradeCard key={index} trade={trade} index={index} />
              ))}
            </div>
          ) : (
            // Desktop View - Table
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">D</TableHead>
                    <TableHead>Trade by</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Market</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Lot</TableHead>
                    <TableHead>QTY</TableHead>
                    <TableHead>Modify</TableHead>
                    <TableHead>Cancel</TableHead>
                    <TableHead>Order Price</TableHead>
                    <TableHead>Net P</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tradeData.map((trade, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell>
                        <input type="radio" name="trade" className="w-4 h-4" />
                      </TableCell>
                      <TableCell className="font-medium">{trade.tradeby}</TableCell>
                      <TableCell>{trade.time}</TableCell>
                      <TableCell>{trade.date}</TableCell>
                      <TableCell>{trade.name}</TableCell>
                      <TableCell>{trade.market}</TableCell>
                      <TableCell>{trade.symbol}</TableCell>
                      <TableCell>{trade.type}</TableCell>
                      <TableCell>{trade.lot}</TableCell>
                      <TableCell>{trade.qty}</TableCell>
                      <TableCell>
                        <Pencil className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
                      </TableCell>
                      <TableCell>
                        <Trash2 className="w-4 h-4 text-gray-500 cursor-pointer hover:text-red-600" />
                      </TableCell>
                      <TableCell>{trade.orderPrice}</TableCell>
                      <TableCell>{trade.netPrice}</TableCell>
                      <TableCell>{trade.status}</TableCell>
                      <TableCell>{trade.ip}</TableCell>
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