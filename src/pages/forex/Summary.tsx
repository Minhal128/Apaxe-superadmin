import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Download, List, File, ChevronDown, ChevronUp, Copy, Search, RefreshCw, Loader2 } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { summaryApi, userApi } from '../../services/api'
import { useApi } from '../../hooks/useApi'
import { toast } from 'react-toastify'

interface ExposureData {
  id: string
  userId: string
  username: string
  segment: string
  totalExposure: number
  totalMargin: number
  unrealizedPnL: number
  utilization: number
  positions: number
  brokerage: number
  netPnL: number
  mtm: number
}

export default function ForexSummary() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    segment: 'FOREX',
    userId: 'all',
    market: 'nse',
    master: 'all',
    broker: 'all',
    client: 'all'
  })

  // API calls
  const {
    data: exposureResponse,
    loading: exposureLoading,
    execute: fetchExposure
  } = useApi(summaryApi.getExposureSummary, {
    immediate: false,
    onError: (err) => {
      console.error('Forex summary fetch error:', err)
    }
  })

  const {
    data: usersResponse
  } = useApi(userApi.getUsers, {
    immediate: true
  })

  const loadData = useCallback(() => {
    const params: any = { segment: 'FOREX' }
    if (filters.userId && filters.userId !== 'all') params.userId = filters.userId
    fetchExposure(params)
  }, [fetchExposure, filters.userId])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(loadData, 10000)
    return () => clearInterval(interval)
  }, [loadData])

  const toggleRow = (id: string) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleExport = () => {
    toast.info('Export functionality coming soon')
  }

  const handleSearch = () => {
    loadData()
  }

  const users = usersResponse?.data?.users || []
  const rawExposureData = exposureResponse?.data?.data?.positions || []

  // Transform exposure data for display
  const summaryData: ExposureData[] = rawExposureData.map((pos: any, index: number) => ({
    id: pos.id || `${index + 1}`,
    userId: pos.userId || '',
    username: pos.username || pos.user || 'N/A',
    segment: pos.segment || 'FOREX',
    totalExposure: pos.exposure || pos.totalExposure || 0,
    totalMargin: pos.marginUsed || pos.totalMargin || 0,
    unrealizedPnL: pos.unrealizedPnL || 0,
    utilization: pos.utilization || 0,
    positions: pos.positionCount || 1,
    brokerage: pos.brokerage || 0,
    netPnL: pos.netPnL || pos.unrealizedPnL || 0,
    mtm: pos.mtm || pos.unrealizedPnL || 0,
  }))

  const filteredData = summaryData.filter(row =>
    !searchQuery || row.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-800">Summary</h1>
            {exposureLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-500" />}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10" onClick={loadData}>
              <RefreshCw className={`w-4 h-4 ${exposureLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10" onClick={handleExport}>
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
            <Select value={filters.market} onValueChange={(v) => handleFilterChange('market', v)}>
              <SelectTrigger className="w-28 sm:w-32 bg-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nse">NSE</SelectItem>
                <SelectItem value="mcx">MCX</SelectItem>
                <SelectItem value="forex">FOREX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Master</Label>
            <Select value={filters.master} onValueChange={(v) => handleFilterChange('master', v)}>
              <SelectTrigger className="w-28 sm:w-32 bg-gray-100">
                <SelectValue placeholder="CE/PE" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Masters</SelectItem>
                {users.filter((u: any) => u.role === 'MASTER').map((u: any) => (
                  <SelectItem key={u.id} value={u.id}>{u.username}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Broker</Label>
            <Select value={filters.broker} onValueChange={(v) => handleFilterChange('broker', v)}>
              <SelectTrigger className="w-28 sm:w-32 bg-gray-100">
                <SelectValue placeholder="Strike" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brokers</SelectItem>
                {users.filter((u: any) => u.role === 'BROKER').map((u: any) => (
                  <SelectItem key={u.id} value={u.id}>{u.username}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Client</Label>
            <Select value={filters.client} onValueChange={(v) => handleFilterChange('client', v)}>
              <SelectTrigger className="w-28 sm:w-32 bg-gray-100">
                <SelectValue placeholder="Strike" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {users.filter((u: any) => u.role === 'CLIENT').map((u: any) => (
                  <SelectItem key={u.id} value={u.id}>{u.username}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={handleSearch}>
            Submit
          </Button>
          <Button variant="outline" onClick={() => setFilters({ segment: 'FOREX', userId: 'all', market: 'nse', master: 'all', broker: 'all', client: 'all' })}>
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
          <span className="text-sm text-gray-600">
            {exposureLoading ? 'Loading data...' : `Showing ${filteredData.length} entries`}
          </span>
          <Button variant="outline" size="sm" className="h-6 w-6 p-0">
            <span className="text-xs">+</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <List className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
          <Download className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" onClick={handleExport} />
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
                {filteredData.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {item.username}
                        <Copy className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600" />
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(item.totalExposure)}</TableCell>
                    <TableCell>{formatCurrency(item.totalMargin)}</TableCell>
                    <TableCell className={item.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(item.unrealizedPnL)}
                    </TableCell>
                    <TableCell className={item.mtm >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(item.mtm)}
                    </TableCell>
                    <TableCell>{formatCurrency(item.brokerage)}</TableCell>
                    <TableCell className={item.netPnL >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(item.netPnL)}
                    </TableCell>
                    <TableCell>{item.utilization.toFixed(2)}%</TableCell>
                    <TableCell>{item.positions}</TableCell>
                    <TableCell>-</TableCell>
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
            {filteredData.map((item, index) => (
              <Card key={item.id} className="m-4 overflow-hidden">
                {/* Header - Always Visible */}
                <div
                  className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleRow(item.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          {item.username}
                          <Copy className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600" />
                        </div>
                        <div className="text-sm text-gray-500">Net P&L: {formatCurrency(item.netPnL)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                      {expandedRows.includes(item.id) ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expandable Content */}
                {expandedRows.includes(item.id) && (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">EXPOSURE:</span>
                        <p className="text-gray-900 font-semibold">{formatCurrency(item.totalExposure)}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">MARGIN:</span>
                        <p className="text-gray-900 font-semibold">{formatCurrency(item.totalMargin)}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">MTM:</span>
                        <p className={`font-semibold ${item.mtm >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(item.mtm)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">BROKERAGE:</span>
                        <p className="text-gray-900 font-semibold">{formatCurrency(item.brokerage)}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">UTILIZATION:</span>
                        <p className="text-gray-900 font-semibold">{item.utilization.toFixed(2)}%</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">POSITIONS:</span>
                        <p className="text-gray-900 font-semibold">{item.positions}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={handleExport}>
                        Export
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredData.length === 0 && !exposureLoading && (
            <div className="p-8 text-center text-gray-500">
              No forex exposure data available
            </div>
          )}
        </Card>

        {/* Pagination - Mobile Friendly */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Showing {filteredData.length} entries
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