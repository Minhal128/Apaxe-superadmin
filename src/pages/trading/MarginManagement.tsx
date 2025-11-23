import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search } from 'lucide-react'

export default function MarginManagement() {
  const marginData = [
    { name: 'DEMO MST-01 (706730) (M', nsefut: { amount: '2,000,000', lot: 0 }, mcxfut: { amount: 0, lot: 0 }, nseopt: { amount: 0, lot: 0 }, total: { amount: '2,000,000', lot: 0 } },
    { name: 'DEMO MST-01 (706730) (M', nsefut: { amount: '2,000,000', lot: 0 }, mcxfut: { amount: 0, lot: 0 }, nseopt: { amount: 0, lot: 0 }, total: { amount: '2,000,000', lot: 0 } },
    { name: 'DEMO MST-01 (706730) (M', nsefut: { amount: '2,000,000', lot: 0 }, mcxfut: { amount: 0, lot: 0 }, nseopt: { amount: 0, lot: 0 }, total: { amount: '2,000,000', lot: 0 } },
    { name: 'DEMO MST-01 (706730) (M', nsefut: { amount: '2,000,000', lot: 0 }, mcxfut: { amount: 0, lot: 0 }, nseopt: { amount: 0, lot: 0 }, total: { amount: '2,000,000', lot: 0 } },
    { name: 'DEMO MST-01 (706730) (M', nsefut: { amount: '2,000,000', lot: 0 }, mcxfut: { amount: 0, lot: 0 }, nseopt: { amount: 0, lot: 0 }, total: { amount: '2,000,000', lot: 0 } },
    { name: 'DEMO MST-01 (706730) (M', nsefut: { amount: '2,000,000', lot: 0 }, mcxfut: { amount: 0, lot: 0 }, nseopt: { amount: 0, lot: 0 }, total: { amount: '2,000,000', lot: 0 } },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Margin Management</h1>
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search"
              className="pl-9 h-10"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4 flex-wrap">
          
          <Select defaultValue="">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expiry">Expiry</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Broker" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expiry">Expiry</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Master" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="select">Select</SelectItem>
            </SelectContent>
          </Select>

          <Button className="bg-green-500 hover:bg-green-600 text-white">
            Search
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700 min-w-[250px]">Name</TableHead>
                  <TableHead colSpan={2} className="font-semibold text-gray-700 text-center border-l border-gray-200">NSEFUT</TableHead>
                  <TableHead colSpan={2} className="font-semibold text-gray-700 text-center border-l border-gray-200">MCXFUT</TableHead>
                  <TableHead colSpan={2} className="font-semibold text-gray-700 text-center border-l border-gray-200">NSEOPT</TableHead>
                  <TableHead colSpan={2} className="font-semibold text-gray-700 text-center border-l border-gray-200">TOTAL</TableHead>
                </TableRow>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700"></TableHead>
                  <TableHead className="font-semibold text-gray-700 border-l border-gray-200">Amount</TableHead>
                  <TableHead className="font-semibold text-gray-700">Lot</TableHead>
                  <TableHead className="font-semibold text-gray-700 border-l border-gray-200">Amount</TableHead>
                  <TableHead className="font-semibold text-gray-700">Lot</TableHead>
                  <TableHead className="font-semibold text-gray-700 border-l border-gray-200">Amount</TableHead>
                  <TableHead className="font-semibold text-gray-700">Lot</TableHead>
                  <TableHead className="font-semibold text-gray-700 border-l border-gray-200">Amount</TableHead>
                  <TableHead className="font-semibold text-gray-700">Lot</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marginData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell className="border-l border-gray-200">{row.nsefut.amount}</TableCell>
                    <TableCell>{row.nsefut.lot}</TableCell>
                    <TableCell className="border-l border-gray-200">{row.mcxfut.amount}</TableCell>
                    <TableCell>{row.mcxfut.lot}</TableCell>
                    <TableCell className="border-l border-gray-200">{row.nseopt.amount}</TableCell>
                    <TableCell>{row.nseopt.lot}</TableCell>
                    <TableCell className="border-l border-gray-200">{row.total.amount}</TableCell>
                    <TableCell>{row.total.lot}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}
