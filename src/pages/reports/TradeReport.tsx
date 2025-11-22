import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

export default function TradeReport() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Trade Report</h1>
          <Input
            type="text"
            placeholder="Search"
            className="w-full sm:w-64 h-10"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <Card className="p-4 sm:p-6">
          <form className="space-y-4 sm:space-y-6">
            {/* First Row - Report, Valan, Select */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="report" className="text-sm sm:text-base">Report</Label>
                <Select>
                  <SelectTrigger id="report" className="h-10 sm:h-11">
                    <SelectValue placeholder="Select report" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="report1">Report 1</SelectItem>
                    <SelectItem value="report2">Report 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="valan" className="text-sm sm:text-base">Valan</Label>
                <Select>
                  <SelectTrigger id="valan" className="h-10 sm:h-11">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="valan1">Valan 1</SelectItem>
                    <SelectItem value="valan2">Valan 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="select" className="text-sm sm:text-base">Select</Label>
                <Select>
                  <SelectTrigger id="select" className="h-10 sm:h-11">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Second Row - Customer, Master, Script */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="customer" className="text-sm sm:text-base">Customer</Label>
                <Input
                  id="customer"
                  type="text"
                  placeholder="Enter customer"
                  className="h-10 sm:h-11"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="master" className="text-sm sm:text-base">Master</Label>
                <Input
                  id="master"
                  type="text"
                  placeholder="Enter master"
                  className="h-10 sm:h-11"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="script" className="text-sm sm:text-base">Script</Label>
                <Input
                  id="script"
                  type="text"
                  placeholder="Enter script"
                  className="h-10 sm:h-11"
                />
              </div>
            </div>

            {/* Third Row - Segment, Select Broker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="segment" className="text-sm sm:text-base">Segment</Label>
                <Select>
                  <SelectTrigger id="segment" className="h-10 sm:h-11">
                    <SelectValue placeholder="Select segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="segment1">Segment 1</SelectItem>
                    <SelectItem value="segment2">Segment 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="selectBroker" className="text-sm sm:text-base">Select Broker</Label>
                <Select>
                  <SelectTrigger id="selectBroker" className="h-10 sm:h-11">
                    <SelectValue placeholder="Select broker" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="broker1">Broker 1</SelectItem>
                    <SelectItem value="broker2">Broker 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Report Type Radio */}
            <div className="grid gap-2">
              <Label className="text-sm sm:text-base">Report Type</Label>
              <RadioGroup defaultValue="holding" className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="holding" id="holding" />
                  <Label htmlFor="holding" className="font-normal cursor-pointer text-sm sm:text-base">
                    Holding
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="payment" id="payment" />
                  <Label htmlFor="payment" className="font-normal cursor-pointer text-sm sm:text-base">
                    Payment
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Date Type Radio */}
            <div className="grid gap-2">
              <Label className="text-sm sm:text-base">Date Type</Label>
              <RadioGroup defaultValue="datewise" className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="datewise" id="datewise" />
                  <Label htmlFor="datewise" className="font-normal cursor-pointer text-sm sm:text-base">
                    Date wise
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="alldata" id="alldata" />
                  <Label htmlFor="alldata" className="font-normal cursor-pointer text-sm sm:text-base">
                    All Data
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* View Report Button */}
            <div className="pt-4">
              <Button className="bg-green-500 hover:bg-green-600 text-white h-10 sm:h-11 w-full sm:w-auto px-8">
                View Report
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}