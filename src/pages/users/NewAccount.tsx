import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { X } from 'lucide-react'

export default function NewAccount() {
  const [nseAccess, setNseAccess] = useState(true)
  const [mcxAccess, setMcxAccess] = useState(false)
  const [ncdftAccess, setNcdftAccess] = useState(false)
  const [globalAccess, setGlobalAccess] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Add new user</h1>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Search"
              className="w-full sm:w-64 h-10"
            />
            <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 sm:p-6">
        <Card>
          <div className="p-4 sm:p-6">
            {/* Account Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Account Type</Label>
                <Select defaultValue="">
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="master">Master</SelectItem>
                    <SelectItem value="dealer">Dealer</SelectItem>
                    <SelectItem value="broker">Broker</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Account Name</Label>
                <Input 
                  type="text" 
                  placeholder="Enter account name" 
                  className="h-10"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Password</Label>
                <Input 
                  type="password" 
                  placeholder="Enter password" 
                  className="h-10"
                />
              </div>
            </div>

            {/* User Notes Section */}
            <div className="mb-6">
              <Label className="text-sm text-gray-600 mb-2 block">User notes</Label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                placeholder="Enter notes"
              />
            </div>

            {/* Market Access Section */}
            <div className="mb-6">
              <Label className="text-sm text-gray-700 mb-3 block font-medium">Market Access</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    id="nse"
                    checked={nseAccess}
                    onChange={(e) => setNseAccess(e.target.checked)}
                    className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                  />
                  <Label htmlFor="nse" className="text-sm font-normal cursor-pointer flex-1">NSE</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    id="mcx"
                    checked={mcxAccess}
                    onChange={(e) => setMcxAccess(e.target.checked)}
                    className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                  />
                  <Label htmlFor="mcx" className="text-sm font-normal cursor-pointer flex-1">MCX</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    id="ncdft"
                    checked={ncdftAccess}
                    onChange={(e) => setNcdftAccess(e.target.checked)}
                    className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                  />
                  <Label htmlFor="ncdft" className="text-sm font-normal cursor-pointer flex-1">NCDFT</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    id="global"
                    checked={globalAccess}
                    onChange={(e) => setGlobalAccess(e.target.checked)}
                    className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                  />
                  <Label htmlFor="global" className="text-sm font-normal cursor-pointer flex-1">GLOBAL</Label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center sm:justify-start">
              <Button className="bg-green-500 hover:bg-green-600 text-white h-10 w-full sm:w-auto px-8">
                Submit
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}