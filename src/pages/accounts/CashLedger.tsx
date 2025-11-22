import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default function CashLedger() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  
  const cashLedgerData = [
    { client: '161422', oldAmount: '0.00', newAmount: '0.00', oldRemark: '-', newRemark: '-', logType: 'Delete', time: '2024-01-11 06:00:03', ip: '103.215.156.14', editTime: '2024-01-11 06:00:03', addTime: '2024-01-11 06:00:03', action: 'E L RP CL A' },
    { client: '161422', oldAmount: '0.00', newAmount: '0.00', oldRemark: '-', newRemark: '-', logType: 'Delete', time: '2024-01-11 06:00:03', ip: '103.215.156.14', editTime: '2024-01-11 06:00:03', addTime: '2024-01-11 06:00:03', action: 'E L RP CL A' },
    { client: '161422', oldAmount: '0.00', newAmount: '0.00', oldRemark: '-', newRemark: '-', logType: 'Delete', time: '2024-01-11 06:00:03', ip: '103.215.156.14', editTime: '2024-01-11 06:00:03', addTime: '2024-01-11 06:00:03', action: 'E L RP CL A' },
    { client: '161422', oldAmount: '0.00', newAmount: '0.00', oldRemark: '-', newRemark: '-', logType: 'Delete', time: '2024-01-11 06:00:03', ip: '103.215.156.14', editTime: '2024-01-11 06:00:03', addTime: '2024-01-11 06:00:03', action: 'E L RP CL A' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-800">Cash Ledger</h1>
        <div className="w-full sm:w-64">
          <Input
            type="text"
            placeholder="Search"
            className="w-full"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search"
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-48">
            <Input
              type="text"
              placeholder="Enter Before"
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-48">
            <Input
              type="text"
              placeholder="Entry After"
              className="w-full"
            />
          </div>
          <Button className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto">
            Submit
          </Button>
        </div>
      </div>

      {/* Mobile Filters Toggle */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:hidden">
        <Button 
          variant="outline" 
          className="w-full justify-between"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        >
          <span>Filters</span>
          <svg 
            className={`w-4 h-4 transform transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
        
        {/* Collapsible Filters for Mobile */}
        {isFiltersOpen && (
          <div className="mt-4 space-y-3">
            <Input
              type="text"
              placeholder="Search"
              className="w-full"
            />
            <Input
              type="text"
              placeholder="Enter Before"
              className="w-full"
            />
            <Input
              type="text"
              placeholder="Entry After"
              className="w-full"
            />
            <Button className="bg-green-500 hover:bg-green-600 text-white w-full">
              Submit
            </Button>
          </div>
        )}
      </div>

      {/* Show All entries */}
      <div className="bg-white px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show All entries</span>
          <Button variant="outline" size="sm" className="h-6 w-6 p-0">
            <span className="text-xs">+</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <svg className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <Card className="overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Client</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Old Amount</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">New Amount</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Old Remark</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">New Remark</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Log Type</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Time</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">IP</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Edit Time</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Add Time</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {cashLedgerData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">{item.client}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{item.oldAmount}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{item.newAmount}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{item.oldRemark}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{item.newRemark}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{item.logType}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{item.time}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{item.ip}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{item.editTime}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">{item.addTime}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm">
                      <div className="flex gap-1 sm:gap-2 flex-wrap">
                        {['E', 'L', 'RP', 'CL', 'A'].map((btn) => (
                          <Button key={btn} variant="outline" size="sm" className="h-6 sm:h-7 px-2 text-xs">
                            {btn}
                          </Button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4 p-4">
            {cashLedgerData.map((item, index) => (
              <Card key={index} className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Client:</span>
                    <p className="text-gray-900">{item.client}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Log Type:</span>
                    <p className="text-gray-900">{item.logType}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Amount:</span>
                    <p className="text-gray-900">{item.oldAmount} → {item.newAmount}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Time:</span>
                    <p className="text-gray-900 text-xs">{item.time}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-gray-500">Remarks:</span>
                    <p className="text-gray-900">{item.oldRemark} → {item.newRemark}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-gray-500">IP:</span>
                    <p className="text-gray-900 text-xs">{item.ip}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Edit Time:</span>
                    <p className="text-gray-900 text-xs">{item.editTime}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Add Time:</span>
                    <p className="text-gray-900 text-xs">{item.addTime}</p>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="flex gap-1 flex-wrap">
                    {['E', 'L', 'RP', 'CL', 'A'].map((btn) => (
                      <Button key={btn} variant="outline" size="sm" className="h-6 px-2 text-xs">
                        {btn}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}