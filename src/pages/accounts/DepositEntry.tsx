import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export default function DepositEntry() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Deposit Entry</h1>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <Card className="p-4 sm:p-6 max-w-2xl mx-auto">
          <form className="space-y-4 sm:space-y-6">
            {/* User Type */}
            <div className="grid gap-2">
              <Label htmlFor="userType" className="text-sm sm:text-base">User Type</Label>
              <Select>
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

            {/* Date */}
            <div className="grid gap-2">
              <Label htmlFor="date" className="text-sm sm:text-base">Date</Label>
              <Input
                id="date"
                type="date"
                className="h-10 sm:h-11"
              />
            </div>

            {/* Amount */}
            <div className="grid gap-2">
              <Label htmlFor="amount" className="text-sm sm:text-base">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                className="h-10 sm:h-11"
              />
            </div>

            {/* Remarks */}
            <div className="grid gap-2">
              <Label htmlFor="remarks" className="text-sm sm:text-base">Remarks</Label>
              <Input
                id="remarks"
                type="text"
                placeholder="Enter remarks"
                className="h-10 sm:h-11"
              />
            </div>

            {/* Deposit/Withdraw Radio */}
            <div className="grid gap-2">
              <Label className="text-sm sm:text-base">Type</Label>
              <RadioGroup defaultValue="deposit" className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="deposit" id="deposit" />
                  <Label htmlFor="deposit" className="font-normal cursor-pointer text-sm sm:text-base">Deposit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="withdraw" id="withdraw" />
                  <Label htmlFor="withdraw" className="font-normal cursor-pointer text-sm sm:text-base">Withdraw</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
              <Button className="bg-green-500 hover:bg-green-600 text-white h-10 sm:h-11 flex-1">
                Save
              </Button>
              <Button variant="outline" className="h-10 sm:h-11 flex-1">
                Clear
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}