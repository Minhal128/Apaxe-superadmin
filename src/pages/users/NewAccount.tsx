import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { userApi } from '../../services/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export default function NewAccount() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    accountType: '',
    accountName: '',
    password: '',
    email: '',
    notes: ''
  })
  const [nseAccess, setNseAccess] = useState(true)
  const [mcxAccess, setMcxAccess] = useState(false)
  const [ncdftAccess, setNcdftAccess] = useState(false)
  const [globalAccess, setGlobalAccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, accountType: value }))
  }

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.accountType || !formData.accountName || !formData.password || !formData.email) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      // Map account type to backend role
      let role = 'CLIENT'
      if (formData.accountType === 'master') role = 'MASTER'
      if (formData.accountType === 'dealer') role = 'SUPER_MASTER'
      if (formData.accountType === 'broker') role = 'MASTER' // Multiple levels of MASTER if needed

      const userData = {
        username: formData.accountName,
        email: formData.email,
        password: formData.password,
        role: role,
        firstName: formData.accountName,
        lastName: '',
        notes: formData.notes,
        permissions: {
          nse: nseAccess,
          mcx: mcxAccess,
          ncdft: ncdftAccess,
          global: globalAccess
        }
      }

      await userApi.createUser(userData)
      toast.success('Account created successfully')

      // Redirect to the appropriate page based on role
      if (role === 'CLIENT') navigate('/users/customer')
      else if (role === 'MASTER') navigate('/users/master')
      else if (role === 'SUPER_MASTER') navigate('/users/dealer')
      else navigate('/users/master')
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || error.response?.data?.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

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
            <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0" onClick={() => navigate(-1)}>
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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Account Type *</Label>
                <Select value={formData.accountType} onValueChange={handleSelectChange}>
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
                <Label className="text-sm text-gray-600 mb-2 block">Account Name *</Label>
                <Input
                  id="accountName"
                  type="text"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  placeholder="Enter account name"
                  className="h-10"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  className="h-10"
                />
              </div>

              <div>
                <Label className="text-sm text-gray-600 mb-2 block">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className="h-10"
                />
              </div>
            </div>

            {/* User Notes Section */}
            <div className="mb-6">
              <Label className="text-sm text-gray-600 mb-2 block">User notes</Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={handleInputChange}
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
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white h-10 w-full sm:w-auto px-8"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {loading ? 'Creating...' : 'Submit'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}