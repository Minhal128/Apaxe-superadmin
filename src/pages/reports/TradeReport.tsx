import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { reportsApi, formatDate, formatCurrency } from '@/services/api'
import { toast } from 'sonner'
import { Loader2, Download } from 'lucide-react'
import { exportToExcel } from '@/lib/exportUtils'

export default function TradeReport() {
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState<any[]>([])
  const [filters, setFilters] = useState({
    customer: '',
    master: '',
    script: '',
    segment: '',
    startDate: '',
    endDate: '',
  })

  const handleViewReport = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await reportsApi.getTradeReport({
        userId: filters.customer || undefined,
        segmentId: filters.segment || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      })
      setReportData(response.data)
      if (response.data.length === 0) {
        toast.info('No trades found for the selected filters')
      } else {
        toast.success(`Found ${response.data.length} trades`)
      }
    } catch (error) {
      toast.error('Failed to fetch trade report')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format: 'excel' | 'pdf') => {
    if (reportData.length === 0) {
      toast.error('No data to export')
      return
    }

    if (format === 'excel') {
      const exportData = reportData.map((trade: any) => ({
        date: formatDate(trade.createdAt),
        customer: trade.user?.username || trade.userId || '-',
        segment: trade.instrument?.segment?.name || '-',
        symbol: trade.instrument?.tradingSymbol || '-',
        side: trade.side,
        quantity: trade.quantity,
        price: trade.price,
        value: trade.quantity * trade.price,
        status: trade.status
      }))

      const columnMapping = {
        date: 'Date',
        customer: 'Customer',
        segment: 'Segment',
        symbol: 'Symbol',
        side: 'Side',
        quantity: 'Quantity',
        price: 'Price',
        value: 'Value',
        status: 'Status'
      }

      exportToExcel(exportData, 'Trade_Report', 'Trades', columnMapping)
      toast.success('Trade report exported successfully')
    } else {
      // PDF export - use API blob approach
      try {
        const response = await reportsApi.getTradeReport({
          ...filters,
          format
        })
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `trade-report-${new Date().getTime()}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        toast.success('PDF exported successfully')
      } catch (error) {
        toast.error('Failed to export as PDF')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Trade Report</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('excel')} disabled={reportData.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')} disabled={reportData.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-6">
        <Card className="p-4 sm:p-6">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleViewReport}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="customer" className="text-sm">Customer ID (Search)</Label>
                <Input
                  id="customer"
                  type="text"
                  placeholder="Enter customer ID"
                  className="h-10"
                  value={filters.customer}
                  onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="script" className="text-sm">Script / Symbol</Label>
                <Input
                  id="script"
                  type="text"
                  placeholder="Enter script"
                  className="h-10"
                  value={filters.script}
                  onChange={(e) => setFilters({ ...filters, script: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="segment" className="text-sm">Segment</Label>
                <Select onValueChange={(val) => setFilters({ ...filters, segment: val })}>
                  <SelectTrigger id="segment" className="h-10">
                    <SelectValue placeholder="Select segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NSE">NSE</SelectItem>
                    <SelectItem value="MCX">MCX</SelectItem>
                    <SelectItem value="FOREX">FOREX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate" className="text-sm">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  className="h-10"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endDate" className="text-sm">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  className="h-10"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white h-10 px-8" disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Fetching...</> : 'View Report'}
              </Button>
            </div>
          </form>
        </Card>

        {reportData.length > 0 && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Trade #</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Instrument</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Side</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((trade: any, idx: number) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{trade.tradeNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{trade.instrument}</td>
                      <td className={`px-4 py-3 text-sm font-bold ${trade.side === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                        {trade.side}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{trade.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(trade.price)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(trade.value)}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(trade.executedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
