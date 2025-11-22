import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function JV() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">JV (Journal Voucher)</h1>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <Card className="p-4 sm:p-6 max-w-2xl mx-auto">
          <form className="space-y-4 sm:space-y-6">
            {/* From Account */}
            <div className="grid gap-2">
              <Label htmlFor="fromAccount" className="text-sm sm:text-base">From Account</Label>
              <Select>
                <SelectTrigger id="fromAccount" className="h-10 sm:h-11">
                  <SelectValue placeholder="Select from account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account1">Account 1</SelectItem>
                  <SelectItem value="account2">Account 2</SelectItem>
                  <SelectItem value="account3">Account 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* To Account */}
            <div className="grid gap-2">
              <Label htmlFor="toAccount" className="text-sm sm:text-base">To Account</Label>
              <Select>
                <SelectTrigger id="toAccount" className="h-10 sm:h-11">
                  <SelectValue placeholder="Select to account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account1">Account 1</SelectItem>
                  <SelectItem value="account2">Account 2</SelectItem>
                  <SelectItem value="account3">Account 3</SelectItem>
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