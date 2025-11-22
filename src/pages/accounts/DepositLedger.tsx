import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function DepositLedger() {
  const depositLedgerData = [
    { client: '161422', oldAmount: '0.00', newAmount: '0.00', oldRemark: '-', newRemark: '-', logType: 'Delete', time: '2024-01-11 06:00:03', ip: '103.215.156.14', editTime: '2024-01-11 06:00:03', addTime: '2024-01-11 06:00:03', action: 'E L RP CL A' },
    { client: '161422', oldAmount: '0.00', newAmount: '0.00', oldRemark: '-', newRemark: '-', logType: 'Delete', time: '2024-01-11 06:00:03', ip: '103.215.156.14', editTime: '2024-01-11 06:00:03', addTime: '2024-01-11 06:00:03', action: 'E L RP CL A' },
    { client: '161422', oldAmount: '0.00', newAmount: '0.00', oldRemark: '-', newRemark: '-', logType: 'Delete', time: '2024-01-11 06:00:03', ip: '103.215.156.14', editTime: '2024-01-11 06:00:03', addTime: '2024-01-11 06:00:03', action: 'E L RP CL A' },
    { client: '161422', oldAmount: '0.00', newAmount: '0.00', oldRemark: '-', newRemark: '-', logType: 'Delete', time: '2024-01-11 06:00:03', ip: '103.215.156.14', editTime: '2024-01-11 06:00:03', addTime: '2024-01-11 06:00:03', action: 'E L RP CL A' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Deposit Ledger</h1>
          <Input
            type="text"
            placeholder="Search"
            className="w-full sm:w-64 h-10"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Input
            type="text"
            placeholder="Search"
            className="w-full sm:w-64 h-10"
          />
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Enter Before"
              className="w-full sm:w-48 h-10"
            />
            <Input
              type="text"
              placeholder="Entry After"
              className="w-full sm:w-48 h-10"
            />
          </div>
          <Button className="bg-green-500 hover:bg-green-600 text-white h-10 w-full sm:w-auto mt-2 sm:mt-0">
            Submit
          </Button>
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
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-4 p-4">
            {depositLedgerData.map((item, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-500">Client:</span>
                      <span className="text-sm font-medium text-gray-900">{item.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-500">Amount:</span>
                      <span className="text-sm text-gray-900">{item.oldAmount} → {item.newAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-500">Log Type:</span>
                      <span className="text-sm text-gray-900">{item.logType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-500">Time:</span>
                      <span className="text-xs text-gray-900">{item.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-500">IP:</span>
                      <span className="text-xs text-gray-900">{item.ip}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 pt-2">
                  {['E', 'L', 'RP', 'CL', 'A'].map((btn) => (
                    <Button key={btn} variant="outline" size="sm" className="h-6 px-2 text-xs flex-1">
                      {btn}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Client</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Old Amount</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">New Amount</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Old Remark</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">New Remark</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Log Type</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Time</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">IP</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Edit Time</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Add Time</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {depositLedgerData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-900">{item.client}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{item.oldAmount}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{item.newAmount}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{item.oldRemark}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{item.newRemark}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{item.logType}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{item.time}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{item.ip}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{item.editTime}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900">{item.addTime}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm">
                      <div className="flex gap-1 sm:gap-2">
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
        </Card>
      </div>
    </div>
  )
}