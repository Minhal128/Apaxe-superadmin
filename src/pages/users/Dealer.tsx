import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Download, List, ChevronDown, ChevronUp, RefreshCw, Loader2, Search } from 'lucide-react'
import { useState, useMemo } from 'react'
import { userApi } from '../../services/api'
import { usePaginatedApi } from '../../hooks/useApi'

export default function Dealer() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  const toggleRow = (index: number) => {
    setExpandedRows(prev =>
      prev.includes(index) ? prev.filter(item => item !== index) : [...prev, index]
    )
  }

  const [searchTerm, setSearchTerm] = useState('')
  const [joinBefore, setJoinBefore] = useState('')
  const [joinAfter, setJoinAfter] = useState('')

  const {
    data: dealers,
    meta,
    loading,
    updateFilters,
    refresh
  } = usePaginatedApi(
    (params) => userApi.getUsers({
      ...params,
      role: 'SUPER_MASTER',
      search: searchTerm,
    }),
    { page: 1, limit: 50 }
  )

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    updateFilters({ search: value })
  }

  const dealerData = useMemo(() => {
    return dealers.map((user: any) => ({
      id: user.id,
      date: new Date(user.createdAt).toLocaleDateString(),
      loginId: user.username || user.id.substring(0, 8),
      p: user.profitSharePercent || 0,
      cCount: user.children?.length || 0,
      master: user.parent?.username || 'N/A',
      actions: ['E', 'L', 'RP', 'CL', 'A'],
      loginTime: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never',
      loginIp: user.sessions?.[0]?.ipAddress || 'N/A',
      joinTime: new Date(user.createdAt).toLocaleDateString()
    }))
  }, [dealers])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-800">Dealer</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search dealers..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0" onClick={() => refresh()}>
            <RefreshCw className={`w - 4 h - 4 ${loading ? 'animate-spin' : ''} `} />
          </Button>
          <Button variant="outline" size="icon" className="shrink-0">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="hidden sm:block bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Market</Label>
            <Select defaultValue="market">
              <SelectTrigger className="w-28 sm:w-32 bg-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Broker</Label>
            <Select defaultValue="">
              <SelectTrigger className="w-28 sm:w-32 bg-gray-100">
                <SelectValue placeholder="Search" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="search">Search</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Join Before</Label>
            <div className="relative">
              <Input
                type="date"
                value={joinBefore}
                onChange={(e) => setJoinBefore(e.target.value)}
                className="w-28 sm:w-40 pr-8"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Join After</Label>
            <div className="relative">
              <Input
                type="date"
                value={joinAfter}
                onChange={(e) => setJoinAfter(e.target.value)}
                className="w-28 sm:w-40 pr-8"
              />
            </div>
          </div>

          <Button className="bg-green-500 hover:bg-green-600 text-white ml-2">
            Submit
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
          <ChevronDown className={`w - 4 h - 4 transform transition - transform ${isFiltersOpen ? 'rotate-180' : ''} `} />
        </Button>

        {/* Collapsible Filters for Mobile */}
        {isFiltersOpen && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 whitespace-nowrap min-w-20">Market</Label>
                <Select defaultValue="market">
                  <SelectTrigger className="bg-gray-100 flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market">Market</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 whitespace-nowrap min-w-20">Broker</Label>
                <Select defaultValue="">
                  <SelectTrigger className="bg-gray-100 flex-1">
                    <SelectValue placeholder="Search" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="search">Search</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 whitespace-nowrap min-w-20">Join Before</Label>
                <div className="relative flex-1">
                  <Input
                    type="date"
                    value={joinBefore}
                    onChange={(e) => setJoinBefore(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-gray-600 whitespace-nowrap min-w-20">Join After</Label>
                <div className="relative flex-1">
                  <Input
                    type="date"
                    value={joinAfter}
                    onChange={(e) => setJoinAfter(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <Button className="bg-green-500 hover:bg-green-600 text-white w-full">
              Submit
            </Button>
          </div>
        )}
      </div>

      {/* Show All entries */}
      <div className="bg-white px-4 sm:px-6 py-3 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {loading ? 'Loading...' : `Showing ${dealerData.length} of ${meta.total} dealers`}
          </span>
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
      <div className="p-4 sm:p-6">
        <Card className="overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="min-w-[100px]">Date</TableHead>
                  <TableHead className="min-w-[100px]">Login ID</TableHead>
                  <TableHead className="min-w-[80px]">P (%)</TableHead>
                  <TableHead className="min-w-[100px]">C. Count</TableHead>
                  <TableHead className="min-w-[200px]">Master</TableHead>
                  <TableHead className="min-w-[180px]">Action</TableHead>
                  <TableHead className="min-w-[120px]">Login Time</TableHead>
                  <TableHead className="min-w-[120px]">Login IP</TableHead>
                  <TableHead className="min-w-[120px]">Join Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dealerData.map((dealer: any, index: number) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{dealer.date}</TableCell>
                    <TableCell>{dealer.loginId}</TableCell>
                    <TableCell>{dealer.p}</TableCell>
                    <TableCell>{dealer.cCount}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={dealer.master}>
                      {dealer.master}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {dealer.actions.map((action: any, idx: number) => (
                          <Button
                            key={idx}
                            size="sm"
                            className="h-6 w-6 p-0 text-xs bg-gray-600 hover:bg-gray-700 text-white"
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{dealer.loginTime}</TableCell>
                    <TableCell className="font-mono text-xs">{dealer.loginIp}</TableCell>
                    <TableCell>{dealer.joinTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {dealerData.map((dealer: any, index: number) => (
              <Card key={index} className="m-4 overflow-hidden">
                {/* Header - Always Visible */}
                <div
                  className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleRow(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">ID: {dealer.loginId}</div>
                        <div className="text-sm text-gray-500">{dealer.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">P: {dealer.p}%</div>
                        <div className="text-xs text-gray-500">Count: {dealer.cCount}</div>
                      </div>
                      {expandedRows.includes(index) ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expandable Content */}
                {expandedRows.includes(index) && (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">Date:</span>
                        <p className="text-gray-900">{dealer.date}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">Login ID:</span>
                        <p className="text-gray-900 font-semibold">{dealer.loginId}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">P (%):</span>
                        <p className="text-gray-900">{dealer.p}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">C. Count:</span>
                        <p className="text-gray-900">{dealer.cCount}</p>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <span className="font-medium text-gray-500">Master:</span>
                        <p className="text-gray-900 text-sm">{dealer.master}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">Login Time:</span>
                        <p className="text-gray-900">{dealer.loginTime}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-500">Join Time:</span>
                        <p className="text-gray-900">{dealer.joinTime}</p>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <span className="font-medium text-gray-500">Login IP:</span>
                        <p className="text-gray-900 font-mono text-xs">{dealer.loginIp}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-gray-200">
                      <span className="font-medium text-gray-500 text-sm mb-2 block">Actions:</span>
                      <div className="flex gap-1 flex-wrap">
                        {dealer.actions.map((action: any, idx: number) => (
                          <Button
                            key={idx}
                            size="sm"
                            className="h-7 w-7 p-0 text-xs bg-gray-600 hover:bg-gray-700 text-white"
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Additional Actions */}
                    <div className="flex gap-2 pt-3">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        Edit
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Empty/Loading State */}
          {!loading && dealerData.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">No dealer data available</div>
              <div className="text-sm text-gray-500">Try adjusting your search filters</div>
            </div>
          )}
          {loading && dealerData.length === 0 && (
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-green-500 mb-2" />
              <div className="text-sm text-gray-500">Fetching dealers...</div>
            </div>
          )}
        </Card>

        {/* Pagination - Mobile Friendly */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="text-sm text-gray-600">
            Page {meta.page} of {meta.totalPages} ({meta.total} total dealers)
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => updateFilters({ page: meta.page - 1 })}
              className="text-xs"
            >
              Previous
            </Button>
            <Button variant="outline" size="sm" className="text-xs bg-gray-100">
              {meta.page}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPages}
              onClick={() => updateFilters({ page: meta.page + 1 })}
              className="text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}