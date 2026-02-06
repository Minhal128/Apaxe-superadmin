import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { accountingApi, userApi } from '../../services/api'
import { toast } from 'react-toastify'
import { Loader2 } from 'lucide-react'

interface User {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  role: string
}

export default function CashEntry() {
  const [loading, setLoading] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [formData, setFormData] = useState({
    userType: '',
    userId: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    remarks: '',
    type: 'CREDIT' as 'CREDIT' | 'DEBIT'
  })

  // Fetch users based on selected user type
  useEffect(() => {
    if (formData.userType) {
      fetchUsers(formData.userType)
    } else {
      setUsers([])
    }
  }, [formData.userType])

  const fetchUsers = async (userType: string) => {
    setLoadingUsers(true)
    try {
      // Map userType to role
      let role = 'CLIENT'
      if (userType === 'master') role = 'MASTER'
      if (userType === 'dealer') role = 'SUPER_MASTER'
      if (userType === 'broker') role = 'MASTER'
      if (userType === 'customer') role = 'CLIENT'

      const response = await userApi.getUsers({ role, limit: 100 })
      if (response.data.success) {
        setUsers(response.data.data.users || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value,
      // Reset userId when userType changes
      ...(field === 'userType' ? { userId: '' } : {})
    }))
  }

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value as 'CREDIT' | 'DEBIT' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.userType) {
      toast.error('Please select a user type')
      return
    }
    if (!formData.userId) {
      toast.error('Please select a user')
      return
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    if (!formData.remarks.trim()) {
      toast.error('Please enter remarks')
      return
    }

    setLoading(true)
    try {
      await accountingApi.createCashEntry({
        userId: formData.userId,
        amount: parseFloat(formData.amount),
        type: formData.type,
        description: formData.remarks,
        reference: `CASH-${formData.date}-${Date.now()}`
      })

      toast.success(`Cash ${formData.type === 'CREDIT' ? 'receipt' : 'payment'} created successfully`)
      handleClear()
    } catch (error: any) {
      console.error('Error creating cash entry:', error)
      toast.error(error.response?.data?.error?.message || error.response?.data?.message || 'Failed to create cash entry')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setFormData({
      userType: '',
      userId: '',
      date: new Date().toISOString().split('T')[0],
      amount: '',
      remarks: '',
      type: 'CREDIT'
    })
    setUsers([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Cash Entry</h1>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <Card className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* User Type */}
            <div className="grid gap-2">
              <Label htmlFor="userType" className="text-sm sm:text-base">User Type *</Label>
              <Select value={formData.userType} onValueChange={(v) => handleSelectChange('userType', v)}>
                <SelectTrigger id="userType" className="h-10 sm:h-11">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                  <SelectItem value="dealer">Dealer</SelectItem>
                  <SelectItem value="broker">Broker</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* User Selection */}
            {formData.userType && (
              <div className="grid gap-2">
                <Label htmlFor="userId" className="text-sm sm:text-base">Select User *</Label>
                <Select 
                  value={formData.userId} 
                  onValueChange={(v) => handleSelectChange('userId', v)}
                  disabled={loadingUsers}
                >
                  <SelectTrigger id="userId" className="h-10 sm:h-11">
                    <SelectValue placeholder={loadingUsers ? 'Loading users...' : 'Select user'} />
                  </SelectTrigger>
                  <SelectContent>
                    {users.length === 0 && !loadingUsers ? (
                      <SelectItem value="none" disabled>No users found</SelectItem>
                    ) : (
                      users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.firstName || user.username} {user.lastName || ''} ({user.email})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Date */}
            <div className="grid gap-2">
              <Label htmlFor="date" className="text-sm sm:text-base">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                className="h-10 sm:h-11"
              />
            </div>

            {/* Amount */}
            <div className="grid gap-2">
              <Label htmlFor="amount" className="text-sm sm:text-base">Amount *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="h-10 sm:h-11"
              />
            </div>

            {/* Remarks */}
            <div className="grid gap-2">
              <Label htmlFor="remarks" className="text-sm sm:text-base">Remarks *</Label>
              <Input
                id="remarks"
                type="text"
                placeholder="Enter remarks (e.g., Cash deposit, Payment received)"
                value={formData.remarks}
                onChange={handleInputChange}
                className="h-10 sm:h-11"
              />
            </div>

            {/* Receipt/Payment Radio */}
            <div className="grid gap-2">
              <Label className="text-sm sm:text-base">Type *</Label>
              <RadioGroup 
                value={formData.type} 
                onValueChange={handleTypeChange}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="CREDIT" id="receipt" />
                  <Label htmlFor="receipt" className="font-normal cursor-pointer text-sm sm:text-base">
                    Receipt (Credit)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="DEBIT" id="payment" />
                  <Label htmlFor="payment" className="font-normal cursor-pointer text-sm sm:text-base">
                    Payment (Debit)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                type="submit"
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white h-10 sm:h-11 flex-1 sm:flex-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
              <Button 
                type="button"
                variant="outline" 
                onClick={handleClear}
                className="h-10 sm:h-11 flex-1 sm:flex-none"
              >
                Clear
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}