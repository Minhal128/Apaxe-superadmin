import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Menu, Download, Loader2 } from 'lucide-react'
import { adminApi } from '@/services/api'
import { useApi } from '@/hooks/useApi'
import { formatDate } from '@/services/api'
import { toast } from 'sonner'
import { useState } from 'react'

export default function Settings() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: bans, loading, execute: refresh } = useApi(adminApi.getBans, { immediate: true })

  const handleRemove = async (id: string) => {
    try {
      if (!confirm('Are you sure you want to remove this ban rule?')) return
      await adminApi.removeBan(id)
      toast.success('Ban rule removed successfully')
      refresh()
    } catch (error) {
      toast.error('Failed to remove ban rule')
    }
  }

  const handleSearch = () => {
    refresh({ search: searchTerm })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Settings (Ban Management)</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Search"
              className="w-full sm:w-64 h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} className="h-10">Search</Button>
          </div>
        </div>
      </div>

      {/* Filters (Simplified for now, can be expanded) */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button className="bg-green-500 hover:bg-green-600 text-white h-10 flex-1 sm:flex-none">
              Add New Rule
            </Button>
          </div>
        </div>
      </div>

      {/* Show All entries */}
      <div className="bg-white px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-600">Active Ban Rules</span>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </div>
        <div className="flex items-center gap-2">
          <Menu className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
          <Download className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <Card className="overflow-hidden">
          {(!bans || bans.length === 0) && !loading ? (
            <div className="p-8 text-center text-gray-500">No active ban rules found.</div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="sm:hidden space-y-3 p-4">
                {(bans || []).map((item: any) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex justify-between">
                          <span className="text-xs font-medium text-gray-500">Scope:</span>
                          <span className="text-sm font-medium text-gray-900">{item.scope}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs font-medium text-gray-500">Script:</span>
                          <span className="text-sm text-gray-900">{item.instrument?.symbol || 'GLOBAL'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs font-medium text-gray-500">Reason:</span>
                          <span className="text-sm text-gray-900">{item.reason || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs font-medium text-gray-500">Time:</span>
                          <span className="text-sm text-gray-900">{formatDate(item.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs font-medium text-gray-500">Banned By:</span>
                          <span className="text-sm text-gray-900">{item.bannedBy?.firstName || 'System'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm" className="flex-1 h-8 text-xs bg-red-50 text-red-600 border-red-200 hover:bg-red-100" onClick={() => handleRemove(item.id)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Scope</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Script</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Reason</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Time</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Banned By</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(bans || []).map((item: any) => (
                      <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900">{item.scope}</td>
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{item.instrument?.symbol || 'GLOBAL'}</td>
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{item.reason || '-'}</td>
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{formatDate(item.createdAt)}</td>
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{item.bannedBy?.firstName || 'System'}</td>
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm">
                          <Button variant="outline" size="sm" className="h-7 px-3 text-xs bg-red-50 text-red-600 border-red-200 hover:bg-red-100" onClick={() => handleRemove(item.id)}>
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
