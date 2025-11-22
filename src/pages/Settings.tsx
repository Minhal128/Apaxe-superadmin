import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, Menu, Download } from 'lucide-react'

export default function Settings() {
  const settingsData = [
    { client: '6456737', market: '6456737', script: '20/10/2025', time: '20/10/2025', remove: '103.215.156.14' },
    { client: '6456738', market: '6456738', script: '21/10/2025', time: '21/10/2025', remove: '103.215.156.15' },
    { client: '6456739', market: '6456739', script: '22/10/2025', time: '22/10/2025', remove: '103.215.156.16' },
    { client: '6456740', market: '6456740', script: '23/10/2025', time: '23/10/2025', remove: '103.215.156.17' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Settings</h1>
          <Input
            type="text"
            placeholder="Search"
            className="w-full sm:w-64 h-10"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-4">
          {/* Filter Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['User', 'Master', 'Market', 'Script'].map((label) => (
              <div key={label} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <span className="text-sm text-gray-600 min-w-[60px]">{label}</span>
                <div className="flex gap-2 w-full">
                  <Input
                    type="text"
                    placeholder="Search"
                    className="w-full h-10"
                  />
                  <Button variant="outline" size="sm" className="h-10 w-10 p-0 flex-shrink-0">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button className="bg-green-500 hover:bg-green-600 text-white h-10 flex-1 sm:flex-none">
              Add
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white h-10 flex-1 sm:flex-none">
              Remove
            </Button>
          </div>
        </div>
      </div>

      {/* Show All entries */}
      <div className="bg-white px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-600">Show All entries</span>
          <Button variant="outline" size="sm" className="h-6 w-6 p-0">
            <span className="text-xs">+</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Menu className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
          <Download className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <Card className="overflow-hidden">
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3 p-4">
            {settingsData.map((item, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-500">Client:</span>
                      <span className="text-sm font-medium text-gray-900">{item.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-500">Market:</span>
                      <span className="text-sm text-gray-900">{item.market}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-500">Script:</span>
                      <span className="text-sm text-gray-900">{item.script}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-500">Time:</span>
                      <span className="text-sm text-gray-900">{item.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-500">Remove:</span>
                      <span className="text-sm text-gray-900">{item.remove}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs bg-red-50 text-red-600 border-red-200 hover:bg-red-100">
                    Delete
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
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Client</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Market</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Script</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Time</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Remove</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {settingsData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900">{item.client}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{item.market}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{item.script}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{item.time}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{item.remove}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-7 px-3 text-xs">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 px-3 text-xs bg-red-50 text-red-600 border-red-200 hover:bg-red-100">
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}