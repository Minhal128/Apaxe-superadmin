import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Download, List, Grid3x3, Copy, File, ChevronDown, ChevronUp, RefreshCw, Loader2 } from 'lucide-react'
import { summaryApi, userApi } from '../services/api'

// Available segments for filtering
const SEGMENTS = [
  { id: 'ALL', name: 'All Segments' },
  { id: 'NSE', name: 'NSE' },
  { id: 'BSE', name: 'BSE' },
  { id: 'NFO', name: 'NFO' },
  { id: 'MCX', name: 'MCX' },
  { id: 'CDS', name: 'CDS' },
]
import { useApi } from '../hooks/useApi'
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

export default function ExposureSummary() {
  const [showAllEntries, setShowAllEntries] = useState(false)
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [filters, setFilters] = useState({
    segment: 'all',
    userId: '',
    master: 'all',
    broker: 'all',
    client: 'all'
  })
  const [searchQuery, setSearchQuery] = useState('')

  // API calls
  const {
    data: exposureResponse,
    loading: exposureLoading,
    execute: fetchExposure
  } = useApi(summaryApi.getExposureSummary, {
    immediate: false,
    onError: () => {
      // Silently handle errors - use fallback data
    }
  })

  const {
    data: usersResponse
  } = useApi(userApi.getUsers, {
    immediate: true,
    onError: () => {
      // Silently handle errors
    }
  })

  // Fetch exposure data
  const loadExposureData = useCallback(() => {
    const params: Record<string, string> = {}
    if (filters.segment && filters.segment !== 'all') params.segment = filters.segment
    if (filters.userId) params.userId = filters.userId
    fetchExposure(params)
  }, [fetchExposure, filters])

  useEffect(() => {
    loadExposureData()
  }, [loadExposureData])

  // Auto-refresh every 5 seconds for real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      loadExposureData()
    }, 5000)
    return () => clearInterval(interval)
  }, [loadExposureData])

  const toggleRow = (id: string) => {
    setExpandedRows(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    loadExposureData()
    toast.info('Refreshing exposure data...')
  }

  const handleReset = () => {
    setFilters({
      segment: 'all',
      userId: '',
      master: 'all',
      broker: 'all',
      client: 'all'
    })
    setSearchQuery('')
  }

  const handleExport = () => {
    toast.info('Export functionality coming soon')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  // Process exposure data from API response
  const segments = SEGMENTS
  const users = Array.isArray(usersResponse?.data) ? usersResponse.data : []
  const rawExposureData = exposureResponse?.data?.data

  // Transform exposure data for display
  const exposureData: ExposureData[] = rawExposureData?.positions?.map((position: any, index: number) => ({
    id: position.id || `${index + 1}`,
    userId: position.userId || '',
    username: position.user || position.username || 'N/A',
    segment: position.segment || 'N/A',
    totalExposure: position.exposure || position.totalExposure || 0,
    totalMargin: position.marginUsed || position.totalMargin || 0,
    unrealizedPnL: position.unrealizedPnL || 0,
    utilization: position.utilization || ((position.marginUsed / (position.exposure || 1)) * 100) || 0,
    positions: position.positionCount || 1,
    brokerage: position.brokerage || 0,
    netPnL: position.netPnL || position.unrealizedPnL || 0,
    mtm: position.mtm || position.unrealizedPnL || 0,
  })) || []

  // Summary stats
  const summaryStats = {
    totalExposure: rawExposureData?.totalExposure || 0,
    totalMargin: rawExposureData?.totalMargin || 0,
    totalUnrealizedPnL: rawExposureData?.totalUnrealizedPnL || 0,
    totalPositions: rawExposureData?.totalPositions || exposureData.length,
  }

  // Filter data based on search
  const filteredData = exposureData.filter(row => {
    if (!searchQuery) return true
    return (
      row.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.segment.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Exposure Summary</h1>
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
            <Button variant="outline" size="icon" className="h-10 w-10" onClick={loadExposureData}>
              <RefreshCw className={`w-4 h-4 ${exposureLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Grid3x3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Total Exposure:</span>
            <span className="ml-2 font-semibold text-gray-900">₹{formatCurrency(summaryStats.totalExposure)}</span>
          </div>
          <div>
            <span className="text-gray-500">Total Margin:</span>
            <span className="ml-2 font-semibold text-gray-900">₹{formatCurrency(summaryStats.totalMargin)}</span>
          </div>
          <div>
            <span className="text-gray-500">Unrealized P&L:</span>
            <span className={`ml-2 font-semibold ${summaryStats.totalUnrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{formatCurrency(summaryStats.totalUnrealizedPnL)}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Positions:</span>
            <span className="ml-2 font-semibold text-gray-900">{summaryStats.totalPositions}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-wrap">
          <div className="grid grid-cols-2 sm:flex gap-3 w-full sm:w-auto">
            <Select value={filters.master} onValueChange={(v) => handleFilterChange('master', v)}>
              <SelectTrigger className="w-full sm:w-32 h-10">
                <SelectValue placeholder="Master" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Masters</SelectItem>
                {users.filter((u: any) => u.role === 'MASTER').map((user: any) => (
                  <SelectItem key={user.id} value={user.id}>{user.username}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.segment} onValueChange={(v) => handleFilterChange('segment', v)}>
              <SelectTrigger className="w-full sm:w-32 h-10">
                <SelectValue placeholder="Market" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Markets</SelectItem>
                {segments.map((seg: any) => (
                  <SelectItem key={seg.id} value={seg.name}>{seg.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.broker} onValueChange={(v) => handleFilterChange('broker', v)}>
              <SelectTrigger className="w-full sm:w-40 h-10">
                <SelectValue placeholder="Broker" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brokers</SelectItem>
                {users.filter((u: any) => u.role === 'BROKER').map((user: any) => (
                  <SelectItem key={user.id} value={user.id}>{user.username}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.client} onValueChange={(v) => handleFilterChange('client', v)}>
              <SelectTrigger className="w-full sm:w-32 h-10">
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {users.filter((u: any) => u.role === 'CLIENT').map((user: any) => (
                  <SelectItem key={user.id} value={user.id}>{user.username}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              className="bg-gray-800 hover:bg-gray-900 text-white h-10 flex-1 sm:flex-none"
              onClick={handleSubmit}
              disabled={exposureLoading}
            >
              {exposureLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Submit
            </Button>
            <Button variant="outline" className="h-10 flex-1 sm:flex-none" onClick={handleReset}>
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
              <Download className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" onClick={handleExport} />
            </div>
            <span className="text-sm text-gray-500">{filteredData.length} records</span>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3 p-4">
            {exposureLoading && filteredData.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                <span className="ml-2 text-gray-500">Loading exposure data...</span>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No exposure data found</div>
            ) : (
              filteredData.map((row) => (
                <div key={row.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleRow(row.id)}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">S.N:</span>
                        <span className="text-sm font-medium text-gray-900">{row.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">Name:</span>
                        <span className="text-sm text-gray-900">{row.username}</span>
                      </div>
                    </div>
                    <div>
                      {expandedRows.includes(row.id) ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {expandedRows.includes(row.id) && (
                    <div className="mt-4 space-y-3 border-t pt-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-xs font-medium text-gray-500">Exposure:</span>
                          <p className="text-sm text-gray-900">₹{formatCurrency(row.totalExposure)}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500">Margin:</span>
                          <p className="text-sm text-gray-900">₹{formatCurrency(row.totalMargin)}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500">MTM:</span>
                          <p className={`text-sm ${row.mtm >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ₹{formatCurrency(row.mtm)}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500">Brokerage:</span>
                          <p className="text-sm text-gray-900">₹{formatCurrency(row.brokerage)}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500">Net P&L:</span>
                          <p className={`text-sm ${row.netPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ₹{formatCurrency(row.netPnL)}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500">Utilization:</span>
                          <p className="text-sm text-gray-900">{row.utilization.toFixed(2)}%</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700 min-w-[50px]">S.N ▼</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[120px]">Name</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">Segment</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[120px]">Exposure</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[120px]">Margin</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">MTM</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">Brokerage</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[120px]">Net P&L</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[100px]">Utilization</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exposureLoading && filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                        <span className="ml-2 text-gray-500">Loading exposure data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                      No exposure data found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((row, index) => (
                    <TableRow key={row.id} className="hover:bg-gray-50">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{row.username}</TableCell>
                      <TableCell>{row.segment}</TableCell>
                      <TableCell>₹{formatCurrency(row.totalExposure)}</TableCell>
                      <TableCell>₹{formatCurrency(row.totalMargin)}</TableCell>
                      <TableCell className={row.mtm >= 0 ? 'text-green-600' : 'text-red-600'}>
                        ₹{formatCurrency(row.mtm)}
                      </TableCell>
                      <TableCell>₹{formatCurrency(row.brokerage)}</TableCell>
                      <TableCell className={row.netPnL >= 0 ? 'text-green-600' : 'text-red-600'}>
                        ₹{formatCurrency(row.netPnL)}
                      </TableCell>
                      <TableCell>{row.utilization.toFixed(2)}%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Copy
                            className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-700"
                            onClick={() => copyToClipboard(row.username)}
                          />
                          <File className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-700" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}
