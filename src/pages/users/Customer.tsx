import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Download, List, Search, Edit, Lock, RefreshCw, CreditCard, Activity } from 'lucide-react'
import { userApi } from '../../services/api'
import { usePaginatedApi } from '../../hooks/useApi'
import { formatDate } from '../../services/api'
import { toast } from 'react-toastify'

export default function Customer() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMarket, setSelectedMarket] = useState('')
  const [joinBefore, setJoinBefore] = useState('')
  const [joinAfter, setJoinAfter] = useState('')

  // Use paginated API for users with CLIENT role
  const {
    data: customers,
    meta,
    loading,
    error,
    updateFilters,
    refresh
  } = usePaginatedApi(
    (params) => userApi.getUsers({
      ...params,
      role: 'CLIENT',
      search: searchTerm,
      // Add other filters as needed
    }),
    { 
      page: 1, 
      limit: 50,
      onError: (error: string) => {
        // Handle authentication errors gracefully
        if (error.includes('401') || error.includes('403') || error.includes('500')) {
          console.log('Users endpoint requires authentication');
        }
      }
    }
  )

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    updateFilters({ search: value })
  }

  // Handle user actions
  const handleEditUser = (userId: string) => {
    toast.info(`Edit user ${userId} - Feature coming soon`)
    // TODO: Implement edit user modal
  }

  const handleLockUser = (userId: string) => {
    toast.info(`Lock/Unlock user ${userId} - Feature coming soon`)
    // TODO: Implement user lock/unlock
  }

  const handleResetPassword = (userId: string) => {
    toast.info(`Reset password for user ${userId} - Feature coming soon`)
    // TODO: Implement password reset
  }

  const handleCreditDebit = (userId: string) => {
    toast.info(`Credit/Debit for user ${userId} - Feature coming soon`)
    // TODO: Implement credit/debit modal
  }

  const handleViewActivity = (userId: string) => {
    toast.info(`View activity for user ${userId} - Feature coming soon`)
    // TODO: Implement activity view
  }

  const handleExport = () => {
    toast.info('Export functionality coming soon')
    // TODO: Implement export
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading customers: {error}</p>
          <Button onClick={refresh}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Customer</h1>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 w-full h-9 sm:h-10"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="shrink-0 h-9 sm:h-10 w-9 sm:w-10"
              onClick={handleExport}
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="shrink-0 h-9 sm:h-10 w-9 sm:w-10"
              onClick={refresh}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Market</Label>
            <Select value={selectedMarket || 'all'} onValueChange={(v) => setSelectedMarket(v === 'all' ? '' : v)}>
              <SelectTrigger className="w-full bg-gray-100 text-xs sm:text-sm h-8 sm:h-10">
                <SelectValue placeholder="All Markets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Markets</SelectItem>
                <SelectItem value="NSE">NSE</SelectItem>
                <SelectItem value="BSE">BSE</SelectItem>
                <SelectItem value="MCX">MCX</SelectItem>
                <SelectItem value="NCDEX">NCDEX</SelectItem>
                <SelectItem value="FOREX">FOREX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Status</Label>
            <Select defaultValue="all">
              <SelectTrigger className="w-full bg-gray-100 text-xs sm:text-sm h-8 sm:h-10">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="BANNED">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Join Before</Label>
            <div className="relative flex-1">
              <Input
                type="date"
                value={joinBefore}
                onChange={(e) => setJoinBefore(e.target.value)}
                className="w-full text-xs sm:text-sm h-8 sm:h-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Join After</Label>
            <div className="relative flex-1">
              <Input
                type="date"
                value={joinAfter}
                onChange={(e) => setJoinAfter(e.target.value)}
                className="w-full text-xs sm:text-sm h-8 sm:h-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Show All entries */}
      <div className="bg-white px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xs sm:text-sm text-gray-600">
            Showing {customers.length} of {meta.total} customers
          </span>
          {loading && (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
              <span className="text-xs text-gray-500">Loading...</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <List className="w-4 h-4 text-gray-500 hover:text-gray-700" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleExport}>
            <Download className="w-4 h-4 text-gray-500 hover:text-gray-700" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 md:p-6">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[800px] sm:min-w-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-xs sm:text-sm px-3 sm:px-4 py-2 font-semibold">Username</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-2 font-semibold">Email</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-2 font-semibold">Status</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-2 font-semibold">Balance</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-2 font-semibold">Parent</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-2 font-semibold">Actions</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-2 font-semibold">Last Login</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-2 font-semibold">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && customers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mr-2"></div>
                          Loading customers...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : customers.length > 0 ? (
                    customers.map((customer: any) => (
                      <TableRow key={customer.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-xs sm:text-sm px-3 sm:px-4 py-2">
                          {customer.username}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                          {customer.email}
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 py-2">
                          <Badge 
                            className={`text-xs ${
                              customer.status === 'ACTIVE' 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : customer.status === 'SUSPENDED'
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2 font-mono">
                          ₹{(customer.balance || 0).toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                          <span className="truncate block max-w-[120px] sm:max-w-none">
                            {customer.parent?.username || 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 py-2">
                          <div className="flex items-center gap-1 flex-wrap">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0 text-[10px] sm:text-xs"
                              onClick={() => handleEditUser(customer.id)}
                              title="Edit User"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0 text-[10px] sm:text-xs"
                              onClick={() => handleLockUser(customer.id)}
                              title="Lock/Unlock User"
                            >
                              <Lock className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0 text-[10px] sm:text-xs"
                              onClick={() => handleResetPassword(customer.id)}
                              title="Reset Password"
                            >
                              RP
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0 text-[10px] sm:text-xs"
                              onClick={() => handleCreditDebit(customer.id)}
                              title="Credit/Debit"
                            >
                              <CreditCard className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0 text-[10px] sm:text-xs"
                              onClick={() => handleViewActivity(customer.id)}
                              title="View Activity"
                            >
                              <Activity className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                          {customer.lastLoginAt ? formatDate(customer.lastLoginAt) : 'Never'}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                          {formatDate(customer.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No customers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}