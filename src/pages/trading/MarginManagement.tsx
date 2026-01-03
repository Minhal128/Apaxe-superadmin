import React, { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, RefreshCw, Loader2, Download } from 'lucide-react'
import { userApi, tradingApi } from '../../services/api'

// Available segments for margin management
const SEGMENTS = ['NSE', 'BSE', 'NFO', 'MCX', 'CDS']
import { useApi } from '../../hooks/useApi'
import { toast } from 'react-toastify'

interface MarginData {
  id: string
  userId: string
  username: string
  role: string
  segments: {
    [key: string]: {
      amount: number
      lot: number
      used: number
      available: number
    }
  }
  total: {
    amount: number
    lot: number
    used: number
    available: number
  }
}

export default function MarginManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    client: '',
    broker: '',
    master: ''
  })

  // API calls
  const {
    data: usersResponse,
    loading: usersLoading,
    execute: fetchUsers
  } = useApi(userApi.getUsers, {
    immediate: true,
    onError: () => {
      // Silently handle errors - use fallback data
    }
  })

  const {
    data: positionsResponse,
    loading: positionsLoading,
    execute: fetchPositions
  } = useApi(tradingApi.getAllPositions, {
    immediate: true,
    onError: () => {
      // Silently handle errors - use fallback data
    }
  })

  // Refresh data
  const refreshData = useCallback(() => {
    fetchUsers({})
    fetchPositions({})
  }, [fetchUsers, fetchPositions])

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData()
    }, 10000)
    return () => clearInterval(interval)
  }, [refreshData])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    toast.info('Applying filters...')
    refreshData()
  }

  const handleExport = () => {
    toast.info('Export functionality coming soon')
  }

  // Process data from API responses
  const users = usersResponse?.data?.users || []
  const segments = SEGMENTS
  const positions = positionsResponse?.data?.positions || positionsResponse?.data || []

  // Calculate margin data per user
  const marginData: MarginData[] = users.map((user: any) => {
    // Get user's positions
    const userPositions = Array.isArray(positions)
      ? positions.filter((p: any) => p.userId === user.id)
      : []

    // Calculate segment-wise margins
    const segmentMargins: { [key: string]: { amount: number; lot: number; used: number; available: number } } = {}

    segments.forEach((seg: string) => {
      const segPositions = userPositions.filter((p: any) =>
        p.instrument?.segment?.name === seg || p.segment === seg
      )

      const usedMargin = segPositions.reduce((sum: number, p: any) => sum + (p.marginUsed || 0), 0)
      const lots = segPositions.reduce((sum: number, p: any) => sum + (p.quantity || 0), 0)

      // Get user's allocated margin for this segment (from user config or default)
      const allocatedMargin = user.marginLimit || user.balance || 0

      segmentMargins[seg] = {
        amount: allocatedMargin,
        lot: lots,
        used: usedMargin,
        available: allocatedMargin - usedMargin
      }
    })

    // Calculate totals
    const totalAmount = Object.values(segmentMargins).reduce((sum, s) => sum + s.amount, 0) || user.balance || 0
    const totalLot = Object.values(segmentMargins).reduce((sum, s) => sum + s.lot, 0)
    const totalUsed = Object.values(segmentMargins).reduce((sum, s) => sum + s.used, 0)

    return {
      id: user.id,
      userId: user.id,
      username: user.username,
      role: user.role,
      segments: segmentMargins,
      total: {
        amount: totalAmount,
        lot: totalLot,
        used: totalUsed,
        available: totalAmount - totalUsed
      }
    }
  })

  // Filter margin data
  const filteredData = marginData.filter(row => {
    // Apply search filter
    if (searchQuery && !row.username.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    // Apply role filters
    if (filters.client && row.role !== 'CLIENT') return false
    if (filters.broker && row.role !== 'BROKER') return false
    if (filters.master && row.role !== 'MASTER') return false

    return true
  })

  const formatCurrency = (value: number) => {
    if (value === 0) return '0'
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const isLoading = usersLoading || positionsLoading

  // Get unique segment names for table headers
  const segmentNames = segments.slice(0, 4) // Limit to 4 segments for display

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-800">Margin Management</h1>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-500" />}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10" onClick={refreshData}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4 flex-wrap">
          <Select value={filters.client || 'all'} onValueChange={(v) => handleFilterChange('client', v === 'all' ? '' : v)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {users.filter((u: any) => u.role === 'CLIENT').map((user: any) => (
                <SelectItem key={user.id} value={user.id}>{user.username}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.broker || 'all'} onValueChange={(v) => handleFilterChange('broker', v === 'all' ? '' : v)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Broker" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brokers</SelectItem>
              {users.filter((u: any) => u.role === 'BROKER').map((user: any) => (
                <SelectItem key={user.id} value={user.id}>{user.username}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.master || 'all'} onValueChange={(v) => handleFilterChange('master', v === 'all' ? '' : v)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Master" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Masters</SelectItem>
              {users.filter((u: any) => u.role === 'MASTER').map((user: any) => (
                <SelectItem key={user.id} value={user.id}>{user.username}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={handleSearch}>
            Search
          </Button>

          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <Card className="overflow-hidden">
          <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
            <span className="text-sm text-gray-500">{filteredData.length} users</span>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700 min-w-[250px]">Name</TableHead>
                  <TableHead className="font-semibold text-gray-700 min-w-[80px]">Role</TableHead>
                  {segmentNames.map((segName: string) => (
                    <TableHead key={segName} colSpan={2} className="font-semibold text-gray-700 text-center border-l border-gray-200">
                      {segName}
                    </TableHead>
                  ))}
                  <TableHead colSpan={2} className="font-semibold text-gray-700 text-center border-l border-gray-200">TOTAL</TableHead>
                </TableRow>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700"></TableHead>
                  <TableHead className="font-semibold text-gray-700"></TableHead>
                  {segmentNames.map((segName: string) => (
                    <React.Fragment key={`${segName}-headers`}>
                      <TableHead className="font-semibold text-gray-700 border-l border-gray-200">Amount</TableHead>
                      <TableHead className="font-semibold text-gray-700">Lot</TableHead>
                    </React.Fragment>
                  ))}
                  <TableHead className="font-semibold text-gray-700 border-l border-gray-200">Amount</TableHead>
                  <TableHead className="font-semibold text-gray-700">Lot</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4 + segmentNames.length * 2} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                        <span className="ml-2 text-gray-500">Loading margin data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4 + segmentNames.length * 2} className="text-center py-8 text-gray-500">
                      No margin data found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((row) => (
                    <TableRow key={row.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{row.username}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${row.role === 'MASTER' ? 'bg-purple-100 text-purple-700' :
                          row.role === 'BROKER' ? 'bg-blue-100 text-blue-700' :
                            row.role === 'CLIENT' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                          }`}>
                          {row.role}
                        </span>
                      </TableCell>
                      {segmentNames.map((segName: string) => (
                        <React.Fragment key={`${row.id}-${segName}`}>
                          <TableCell className="border-l border-gray-200">
                            {formatCurrency(row.segments[segName]?.amount || 0)}
                          </TableCell>
                          <TableCell>
                            {row.segments[segName]?.lot || 0}
                          </TableCell>
                        </React.Fragment>
                      ))}
                      <TableCell className="border-l border-gray-200 font-semibold">
                        {formatCurrency(row.total.amount)}
                      </TableCell>
                      <TableCell className="font-semibold">{row.total.lot}</TableCell>
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
