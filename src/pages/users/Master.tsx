import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Calendar, Download, List, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { userApi } from '../../services/api'
import { useApi } from '../../hooks/useApi'
import { toast } from 'react-toastify'

export default function Master() {
  const [isMobile, setIsMobile] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [filters, setFilters] = useState({
    role: 'MASTER', // Filter for MASTER role only
    status: '',
    search: '',
    page: 1,
    limit: 50
  })

  // API call for users data
  const { 
    data: usersResponse, 
    loading: usersLoading, 
    execute: fetchUsers 
  } = useApi(userApi.getUsers, { immediate: false })

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Fetch users when component mounts or filters change
  useEffect(() => {
    fetchUsers(filters)
  }, [fetchUsers, filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }))
  }

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      page: 1
    }))
  }

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }))
  }

  const handleExport = async () => {
    try {
      toast.info('Export functionality coming soon')
    } catch (error) {
      toast.error('Failed to export data')
    }
  }

  // Get users data from API response
  // API returns { success, message, data: [...users], meta: {...} }
  const users = Array.isArray(usersResponse?.data) ? usersResponse.data : []
  const pagination = usersResponse?.meta || { page: 1, totalPages: 1, total: users.length }

  const MobileMasterCard = ({ user, index }: { user: any, index: number }) => (
    <Card key={index} className="p-4 mb-4">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${
              user.status === 'ACTIVE' ? 'bg-green-500' : 
              user.status === 'INACTIVE' ? 'bg-gray-500' : 
              user.status === 'SUSPENDED' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <div>
              <div className="font-medium text-sm">{user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'N/A'}</div>
              <div className="text-xs text-gray-500">ID: {user.id}</div>
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
            <span className="text-gray-500 text-xs">Role</span>
            <div className="font-medium">{user.role}</div>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Status</span>
            <div className="font-medium">{user.status}</div>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Balance</span>
            <div className="font-medium">₹{user.balance?.toLocaleString() || '0'}</div>
          </div>
          <div>
            <span className="text-gray-500 text-xs">Email</span>
            <div className="font-medium text-xs">{user.email}</div>
          </div>
        </div>

        {/* Expandable Details */}
        {expandedRow === index && (
          <div className="border-t pt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500 text-xs">Username</span>
                <div className="font-medium">{user.username}</div>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Phone</span>
                <div className="font-medium text-xs">{user.phone || 'N/A'}</div>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 text-xs">Created At</span>
                <div className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 text-xs">Last Login</span>
                <div className="font-medium">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}</div>
              </div>
            </div>

            {/* Actions */}
            <div>
              <span className="text-gray-500 text-xs block mb-2">Actions</span>
              <div className="flex items-center gap-1 flex-wrap">
                <Button size="sm" className="h-6 px-2 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                  Edit
                </Button>
                <Button size="sm" className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700 text-white">
                  Balance
                </Button>
                <Button size="sm" className="h-6 px-2 text-xs bg-yellow-600 hover:bg-yellow-700 text-white">
                  Reset
                </Button>
                <Button size="sm" className="h-6 px-2 text-xs bg-gray-600 hover:bg-gray-700 text-white">
                  View
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Actions - Collapsed View */}
        {expandedRow !== index && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-1">
              <Button size="sm" className="h-6 px-2 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                Edit
              </Button>
              <Button size="sm" className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700 text-white">
                Balance
              </Button>
              <span className="text-xs text-gray-500 ml-1">+2 more</span>
            </div>
            <span className="text-xs text-gray-500">Click to expand</span>
          </div>
        )}
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Users Management</h1>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search users..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
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
          <Button variant="outline" size="icon" className="hidden md:flex" onClick={handleExport}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className={`bg-white border-b border-gray-200 px-4 md:px-6 py-4 ${isMobile && !showFilters ? 'hidden' : 'block'}`}>
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Role</Label>
            <Select value={filters.role || 'all'} onValueChange={(value) => handleFilterChange('role', value === 'all' ? '' : value)}>
              <SelectTrigger className="w-full md:w-32 bg-gray-100">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SUPER_MASTER">Super Master</SelectItem>
                <SelectItem value="MASTER">Master</SelectItem>
                <SelectItem value="CLIENT">Client</SelectItem>
                <SelectItem value="VIEW_ONLY">View Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Status</Label>
            <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}>
              <SelectTrigger className="w-full md:w-32 bg-gray-100">
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

          <div className="grid grid-cols-1 md:flex md:items-center gap-4 md:gap-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 whitespace-nowrap">Created After</Label>
              <div className="relative flex-1">
                <Input
                  type="date"
                  className="w-full md:w-32 pr-8"
                />
                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 whitespace-nowrap">Created Before</Label>
              <div className="relative flex-1">
                <Input
                  type="date"
                  className="w-full md:w-32 pr-8"
                />
                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Show All entries */}
      <div className="bg-white px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {usersLoading ? 'Loading...' : `Showing ${users.length} of ${pagination.total} users`}
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
      <div className="p-4 md:p-6">
        <Card className="overflow-hidden">
          {usersLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-2">No users found</p>
              <p className="text-sm text-gray-500">Try adjusting your search filters</p>
            </div>
          ) : isMobile ? (
            // Mobile View - Cards
            <div className="p-4">
              {users.map((user: any, index: number) => (
                <MobileMasterCard key={user.id} user={user} index={index} />
              ))}
            </div>
          ) : (
            // Desktop View - Table
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: any) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'N/A'}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'SUPER_MASTER' ? 'bg-blue-100 text-blue-800' :
                          user.role === 'MASTER' ? 'bg-green-100 text-green-800' :
                          user.role === 'CLIENT' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          user.status === 'INACTIVE' ? 'bg-gray-100 text-gray-800' :
                          user.status === 'SUSPENDED' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell>₹{user.balance?.toLocaleString() || '0'}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="sm" className="h-6 px-2 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                            Edit
                          </Button>
                          <Button size="sm" className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700 text-white">
                            Balance
                          </Button>
                          <Button size="sm" className="h-6 px-2 text-xs bg-yellow-600 hover:bg-yellow-700 text-white">
                            Reset
                          </Button>
                          <Button size="sm" className="h-6 px-2 text-xs bg-gray-600 hover:bg-gray-700 text-white">
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>

        {/* Pagination */}
        {!usersLoading && users.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <div className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total users)
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="text-xs"
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button 
                    key={pageNum}
                    variant="outline" 
                    size="sm" 
                    className={`text-xs ${pagination.page === pageNum ? 'bg-gray-100' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}