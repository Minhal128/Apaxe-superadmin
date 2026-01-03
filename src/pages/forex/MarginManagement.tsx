import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { ChevronDown, ChevronUp, Search, RefreshCw, Loader2 } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { userApi, tradingApi } from '../../services/api'
import { useApi } from '../../hooks/useApi'

interface MarginData {
  id: string
  name: string
  nsefutAmount: string
  nsefutLot: string
  mcxfutAmount: string
  mcxfutLot: string
  nseoptAmount: string
  nseoptLot: string
  totalAmount: string
  totalLot: string
  role: string
}

export default function ForexMarginManagement() {
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    client: 'all',
    broker: 'all',
    master: 'all'
  })

  // API calls
  const {
    data: usersResponse,
    loading: usersLoading,
    execute: fetchUsers
  } = useApi(userApi.getUsers, {
    immediate: true
  })

  const {
    data: positionsResponse,
    loading: positionsLoading,
    execute: fetchPositions
  } = useApi(tradingApi.getAllPositions, {
    immediate: true
  })

  const refreshData = useCallback(() => {
    fetchUsers({})
    fetchPositions({})
  }, [fetchUsers, fetchPositions])

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(refreshData, 10000)
    return () => clearInterval(interval)
  }, [refreshData])

  const toggleRow = (id: string) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    refreshData()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  // Data processing
  const users = Array.isArray(usersResponse?.data) ? usersResponse.data : []
  const positions = positionsResponse?.data?.positions || positionsResponse?.data || []

  const marginData: MarginData[] = users.map((user: any) => {
    const userPositions = Array.isArray(positions)
      ? positions.filter((p: any) => p.userId === user.id)
      : []

    const getSegmentStats = (segmentName: string) => {
      const segPos = userPositions.filter((p: any) =>
        (p.instrument?.segment?.name === segmentName || p.segment === segmentName)
      )
      const amount = segPos.reduce((sum: number, p: any) => sum + (p.marginUsed || 0), 0)
      const lot = segPos.reduce((sum: number, p: any) => sum + (p.quantity || 0), 0)
      return { amount, lot }
    }

    const nsefut = getSegmentStats('NSE') // Mapping NSE to NSEFUT for now
    const mcxfut = getSegmentStats('MCX')
    const nseopt = getSegmentStats('NFO') // Mapping NFO to NSEOPT

    const totalAmount = nsefut.amount + mcxfut.amount + nseopt.amount + (user.balance || 0)
    const totalLot = nsefut.lot + mcxfut.lot + nseopt.lot

    return {
      id: user.id,
      name: user.username,
      role: user.role,
      nsefutAmount: formatCurrency(nsefut.amount),
      nsefutLot: nsefut.lot.toString(),
      mcxfutAmount: formatCurrency(mcxfut.amount),
      mcxfutLot: mcxfut.lot.toString(),
      nseoptAmount: formatCurrency(nseopt.amount),
      nseoptLot: nseopt.lot.toString(),
      totalAmount: formatCurrency(totalAmount),
      totalLot: totalLot.toString()
    }
  })

  const filteredData = marginData.filter(item => {
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (filters.client !== 'all' && item.role !== 'CLIENT') return false
    if (filters.broker !== 'all' && item.role !== 'BROKER') return false
    if (filters.master !== 'all' && item.role !== 'MASTER') return false
    return true
  })

  const isLoading = usersLoading || positionsLoading

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Margin Management</h1>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-500" />}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search"
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

      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 min-w-[50px]">Client</Label>
              <Select value={filters.client} onValueChange={(v) => handleFilterChange('client', v)}>
                <SelectTrigger className="w-full sm:w-32 h-10 bg-gray-100">
                  <SelectValue placeholder="All Clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {users.filter((u: any) => u.role === 'CLIENT').map((u: any) => (
                    <SelectItem key={u.id} value={u.id}>{u.username}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 min-w-[50px]">Broker</Label>
              <Select value={filters.broker} onValueChange={(v) => handleFilterChange('broker', v)}>
                <SelectTrigger className="w-full sm:w-32 h-10 bg-gray-100">
                  <SelectValue placeholder="All Brokers" />
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
              <Label className="text-sm text-gray-600 min-w-[50px]">Master</Label>
              <Select value={filters.master} onValueChange={(v) => handleFilterChange('master', v)}>
                <SelectTrigger className="w-full sm:w-32 h-10 bg-gray-100">
                  <SelectValue placeholder="All Masters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Masters</SelectItem>
                  {users.filter((u: any) => u.role === 'MASTER').map((u: any) => (
                    <SelectItem key={u.id} value={u.id}>{u.username}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <Button className="bg-green-500 hover:bg-green-600 text-white h-10 flex-1 sm:flex-none" onClick={handleSearch}>
              Search
            </Button>
            <Button variant="outline" className="h-10 flex-1 sm:flex-none" onClick={() => setFilters({ client: 'all', broker: 'all', master: 'all' })}>
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <Card className="overflow-hidden">
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3 p-4">
            {filteredData.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleRow(item.id)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">Name:</span>
                      <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">Total:</span>
                      <span className="text-sm text-gray-900">{item.totalAmount} / {item.totalLot} lots</span>
                    </div>
                  </div>
                  <div>
                    {expandedRows.includes(item.id) ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedRows.includes(item.id) && (
                  <div className="mt-4 space-y-4 border-t pt-4">
                    {/* NSEFUT Section */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="text-xs font-semibold text-blue-800 mb-2">NSEFUT</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs text-blue-600">Amount:</span>
                          <p className="text-sm font-medium text-blue-900">{item.nsefutAmount}</p>
                        </div>
                        <div>
                          <span className="text-xs text-blue-600">Lot:</span>
                          <p className="text-sm font-medium text-blue-900">{item.nsefutLot}</p>
                        </div>
                      </div>
                    </div>

                    {/* MCXFUT Section */}
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="text-xs font-semibold text-green-800 mb-2">MCXFUT</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs text-green-600">Amount:</span>
                          <p className="text-sm font-medium text-green-900">{item.mcxfutAmount}</p>
                        </div>
                        <div>
                          <span className="text-xs text-green-600">Lot:</span>
                          <p className="text-sm font-medium text-green-900">{item.mcxfutLot}</p>
                        </div>
                      </div>
                    </div>

                    {/* NSEOPT Section */}
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h4 className="text-xs font-semibold text-purple-800 mb-2">NSEOPT</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs text-purple-600">Amount:</span>
                          <p className="text-sm font-medium text-purple-900">{item.nseoptAmount}</p>
                        </div>
                        <div>
                          <span className="text-xs text-purple-600">Lot:</span>
                          <p className="text-sm font-medium text-purple-900">{item.nseoptLot}</p>
                        </div>
                      </div>
                    </div>

                    {/* TOTAL Section */}
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <h4 className="text-xs font-semibold text-orange-800 mb-2">TOTAL</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-xs text-orange-600">Amount:</span>
                          <p className="text-sm font-medium text-orange-900">{item.totalAmount}</p>
                        </div>
                        <div>
                          <span className="text-xs text-orange-600">Lot:</span>
                          <p className="text-sm font-medium text-orange-900">{item.totalLot}</p>
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
                  <TableHead rowSpan={2} className="border-r border-gray-200 min-w-[200px]">Name</TableHead>
                  <TableHead colSpan={2} className="text-center border-r border-gray-200 bg-blue-50">NSEFUT</TableHead>
                  <TableHead colSpan={2} className="text-center border-r border-gray-200 bg-green-50">MCXFUT</TableHead>
                  <TableHead colSpan={2} className="text-center border-r border-gray-200 bg-purple-50">NSEOPT</TableHead>
                  <TableHead colSpan={2} className="text-center bg-orange-50">TOTAL</TableHead>
                </TableRow>
                <TableRow className="bg-gray-50">
                  <TableHead className="border-r border-gray-200 bg-blue-50 min-w-[120px]">Amount</TableHead>
                  <TableHead className="border-r border-gray-200 bg-blue-50 min-w-[80px]">Lot</TableHead>
                  <TableHead className="border-r border-gray-200 bg-green-50 min-w-[120px]">Amount</TableHead>
                  <TableHead className="border-r border-gray-200 bg-green-50 min-w-[80px]">Lot</TableHead>
                  <TableHead className="border-r border-gray-200 bg-purple-50 min-w-[120px]">Amount</TableHead>
                  <TableHead className="border-r border-gray-200 bg-purple-50 min-w-[80px]">Lot</TableHead>
                  <TableHead className="border-r border-gray-200 bg-orange-50 min-w-[120px]">Amount</TableHead>
                  <TableHead className="bg-orange-50 min-w-[80px]">Lot</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 && !isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No margin data found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium border-r border-gray-200">{item.name}</TableCell>
                      <TableCell className="border-r border-gray-200">{item.nsefutAmount}</TableCell>
                      <TableCell className="border-r border-gray-200">{item.nsefutLot}</TableCell>
                      <TableCell className="border-r border-gray-200">{item.mcxfutAmount}</TableCell>
                      <TableCell className="border-r border-gray-200">{item.mcxfutLot}</TableCell>
                      <TableCell className="border-r border-gray-200">{item.nseoptAmount}</TableCell>
                      <TableCell className="border-r border-gray-200">{item.nseoptLot}</TableCell>
                      <TableCell className="border-r border-gray-200">{item.totalAmount}</TableCell>
                      <TableCell>{item.totalLot}</TableCell>
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