import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Calendar, Search, Filter, ChevronDown, ChevronUp, Download, List } from 'lucide-react'

export default function DepositLedger() {
  const [isMobile, setIsMobile] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const depositLedgerData = [
    { 
      client: '161422',
      oldAmount: '₹ 50,000.00',
      newAmount: '₹ 75,000.00',
      oldRemark: 'Initial deposit',
      newRemark: 'Additional funds added',
      logType: 'Amount Update',
      time: '11-10-2025, 16:45',
      ip: '103.215.156.14',
      editTime: '11-10-2025, 16:45',
      addTime: '11-10-2025, 16:30'
    },
    { 
      client: '161423',
      oldAmount: '₹ 25,000.00',
      newAmount: '₹ 30,000.00',
      oldRemark: 'Monthly deposit',
      newRemark: 'Bonus added',
      logType: 'Bonus Credit',
      time: '11-10-2025, 14:20',
      ip: '103.215.156.15',
      editTime: '11-10-2025, 14:20',
      addTime: '11-10-2025, 14:15'
    },
    { 
      client: '161424',
      oldAmount: '₹ 1,00,000.00',
      newAmount: '₹ 80,000.00',
      oldRemark: 'Full balance',
      newRemark: 'Withdrawal processed',
      logType: 'Withdrawal',
      time: '11-10-2025, 12:10',
      ip: '103.215.156.16',
      editTime: '11-10-2025, 12:10',
      addTime: '11-10-2025, 12:00'
    },
  ]

  const MobileLogCard = ({ log, index }: { log: typeof depositLedgerData[0], index: number }) => (
    <Card key={index} className="p-4 mb-4">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${
              log.logType === 'Amount Update' ? 'bg-blue-500' :
              log.logType === 'Bonus Credit' ? 'bg-green-500' : 'bg-orange-500'
            }`}></div>
            <div>
              <div className="font-medium text-sm">Client: {log.client}</div>
              <div className="text-xs text-gray-500">{log.logType}</div>
            </div>
          </div>
          <button 
            onClick={() => setExpandedRow(expandedRow === index ? null : index)}
            className="text-gray-400 hover:text-gray-600"
          >
            {expandedRow === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500 text-xs">Old Amount</span>
            <div className="font-medium">{log.oldAmount}</div>
          </div>
          <div>
            <span className="text-gray-500 text-xs">New Amount</span>
            <div className={`font-medium ${
              parseFloat(log.newAmount.replace(/[^0-9.]/g, '')) > parseFloat(log.oldAmount.replace(/[^0-9.]/g, '')) 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {log.newAmount}
            </div>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Time</span>
            <div className="font-medium text-xs">{log.time}</div>
          </div>
          <div>
            <span className="text-gray-500 text-xs">IP Address</span>
            <div className="font-medium text-xs">{log.ip}</div>
          </div>
        </div>

        {/* Expandable Details */}
        {expandedRow === index && (
          <div className="border-t pt-3 space-y-3">
            {/* Remarks */}
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div>
                <span className="text-gray-500 text-xs">Old Remark</span>
                <div className="font-medium bg-gray-50 p-2 rounded text-xs">{log.oldRemark}</div>
              </div>
              <div>
                <span className="text-gray-500 text-xs">New Remark</span>
                <div className="font-medium bg-gray-50 p-2 rounded text-xs">{log.newRemark}</div>
              </div>
            </div>

            {/* Additional Times */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500 text-xs">Edit Time</span>
                <div className="font-medium text-xs">{log.editTime}</div>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Add Time</span>
                <div className="font-medium text-xs">{log.addTime}</div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2 text-xs">
              <div className={`px-2 py-1 rounded ${
                log.logType === 'Amount Update' ? 'bg-blue-100 text-blue-700' :
                log.logType === 'Bonus Credit' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {log.logType}
              </div>
              <span className="text-gray-500">
                {parseFloat(log.newAmount.replace(/[^0-9.]/g, '')) > parseFloat(log.oldAmount.replace(/[^0-9.]/g, '')) 
                  ? '↑ Increase' 
                  : '↓ Decrease'}
              </span>
            </div>
          </div>
        )}

        {/* Quick View - Collapsed */}
        {expandedRow !== index && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-xs text-gray-500">
              {log.oldRemark} → {log.newRemark}
            </div>
            <span className="text-xs text-gray-400">Tap for details</span>
          </div>
        )}
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">User Edit logs</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search"
              className="w-32 md:w-64 pl-8 md:pl-3"
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 md:hidden" />
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className={`bg-white border-b border-gray-200 px-4 md:px-6 py-4 ${isMobile && !showFilters ? 'hidden' : 'block'}`}>
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-4 flex-wrap">
          <div className="grid grid-cols-1 md:flex md:items-center gap-4 md:gap-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 whitespace-nowrap">From</Label>
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
              <Label className="text-sm text-gray-600 whitespace-nowrap">To</Label>
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

          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Client</Label>
            <Select defaultValue="">
              <SelectTrigger className="w-full md:w-32 bg-gray-100">
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
              </SelectContent>
            </Select>
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
            <div className="p-4">
              {depositLedgerData.map((log, index) => (
                <MobileLogCard key={index} log={log} index={index} />
              ))}
            </div>
          ) : (
            // Desktop View - Table
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Client</TableHead>
                    <TableHead>Old Amount</TableHead>
                    <TableHead>New Amount</TableHead>
                    <TableHead>Old Remark</TableHead>
                    <TableHead>New Remark</TableHead>
                    <TableHead>Log Type</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Edit Time</TableHead>
                    <TableHead>Add Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {depositLedgerData.map((log, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{log.client}</TableCell>
                      <TableCell>{log.oldAmount}</TableCell>
                      <TableCell className={
                        parseFloat(log.newAmount.replace(/[^0-9.]/g, '')) > parseFloat(log.oldAmount.replace(/[^0-9.]/g, '')) 
                          ? 'text-green-600 font-medium' 
                          : 'text-red-600 font-medium'
                      }>
                        {log.newAmount}
                      </TableCell>
                      <TableCell>
                        <span className="bg-gray-50 px-2 py-1 rounded text-xs">
                          {log.oldRemark}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="bg-gray-50 px-2 py-1 rounded text-xs">
                          {log.newRemark}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          log.logType === 'Amount Update' ? 'bg-blue-100 text-blue-700' :
                          log.logType === 'Bonus Credit' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {log.logType}
                        </span>
                      </TableCell>
                      <TableCell>{log.time}</TableCell>
                      <TableCell className="text-xs">{log.ip}</TableCell>
                      <TableCell>{log.editTime}</TableCell>
                      <TableCell>{log.addTime}</TableCell>
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