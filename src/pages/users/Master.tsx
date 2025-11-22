import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Calendar, Download, List, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react'

export default function Master() {
  const [isMobile, setIsMobile] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const masterData = [
    { 
      date: '09-10-2025',
      loginId: '161422',
      p: '1',
      dCount: '3',
      bCount: '4',
      cCount: '0',
      master: 'DEMO MST-01-Master (706730)',
      actions: ['E', 'L', 'RP', 'CL', 'A'],
      loginTime: '2025-06-06',
      loginIp: '103.215.156.14',
      joinTime: '2025-06-06'
    },
    { 
      date: '09-10-2025',
      loginId: '161422',
      p: '1',
      dCount: '3',
      bCount: '4',
      cCount: '0',
      master: 'DEMO MST-01-Master (706730)',
      actions: ['E', 'L', 'RP', 'CL', 'A'],
      loginTime: '2025-06-06',
      loginIp: '103.215.156.14',
      joinTime: '2025-06-06'
    },
    { 
      date: '09-10-2025',
      loginId: '161422',
      p: '1',
      dCount: '3',
      bCount: '4',
      cCount: '0',
      master: 'DEMO MST-01-Master (706730)',
      actions: ['E', 'L', 'RP', 'CL', 'A'],
      loginTime: '2025-06-06',
      loginIp: '103.215.156.14',
      joinTime: '2025-06-06'
    },
  ]

  const MobileMasterCard = ({ master, index }: { master: typeof masterData[0], index: number }) => (
    <Card key={index} className="p-4 mb-4">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <div className="font-medium text-sm">{master.master}</div>
              <div className="text-xs text-gray-500">ID: {master.loginId}</div>
            </div>
          </div>
          <button 
            onClick={() => setExpandedRow(expandedRow === index ? null : index)}
            className="text-gray-400 hover:text-gray-600"
          >
            {expandedRow === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500 text-xs">Date</span>
            <div className="font-medium">{master.date}</div>
          </div>
          <div>
            <span className="text-gray-500 text-xs">P (%)</span>
            <div className="font-medium">{master.p}%</div>
          </div>
          <div>
            <span className="text-gray-500 text-xs">D. Count</span>
            <div className="font-medium">{master.dCount}</div>
          </div>
          <div>
            <span className="text-gray-500 text-xs">B. Count</span>
            <div className="font-medium">{master.bCount}</div>
          </div>
        </div>

        {/* Expandable Details */}
        {expandedRow === index && (
          <div className="border-t pt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500 text-xs">C. Count</span>
                <div className="font-medium">{master.cCount}</div>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Login IP</span>
                <div className="font-medium text-xs">{master.loginIp}</div>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 text-xs">Login Time</span>
                <div className="font-medium">{master.loginTime}</div>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 text-xs">Join Time</span>
                <div className="font-medium">{master.joinTime}</div>
              </div>
            </div>

            {/* Actions */}
            <div>
              <span className="text-gray-500 text-xs block mb-2">Actions</span>
              <div className="flex items-center gap-1 flex-wrap">
                {master.actions.map((action, idx) => (
                  <Button
                    key={idx}
                    size="sm"
                    className="h-6 w-6 p-0 text-xs bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions - Collapsed View */}
        {expandedRow !== index && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-1">
              {master.actions.slice(0, 3).map((action, idx) => (
                <Button
                  key={idx}
                  size="sm"
                  className="h-6 w-6 p-0 text-xs bg-gray-600 hover:bg-gray-700 text-white"
                >
                  {action}
                </Button>
              ))}
              {master.actions.length > 3 && (
                <span className="text-xs text-gray-500 ml-1">
                  +{master.actions.length - 3} more
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">Click to expand</span>
          </div>
        )}
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Master</h1>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search"
              className="w-32 md:w-64 pl-8 md:pl-3"
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 md:hidden" />
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="hidden md:flex">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className={`bg-white border-b border-gray-200 px-4 md:px-6 py-4 ${isMobile && !showFilters ? 'hidden' : 'block'}`}>
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Market</Label>
            <Select defaultValue="market">
              <SelectTrigger className="w-full md:w-32 bg-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-600 whitespace-nowrap">Broker</Label>
            <Select defaultValue="">
              <SelectTrigger className="w-full md:w-32 bg-gray-100">
                <SelectValue placeholder="Search" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="search">Search</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:flex md:items-center gap-4 md:gap-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 whitespace-nowrap">Join Before</Label>
              <div className="relative flex-1">
                <Input
                  type="text"
                  defaultValue="10/12/2025"
                  className="w-full md:w-32 pr-8"
                />
                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 whitespace-nowrap">Join After</Label>
              <div className="relative flex-1">
                <Input
                  type="text"
                  defaultValue="10/12/2025"
                  className="w-full md:w-32 pr-8"
                />
                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Show All entries */}
      <div className="bg-white px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show All entries</span>
          <Button variant="outline" size="sm" className="h-6 w-6 p-0">
            <span className="text-xs">+</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <List className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
          <Download className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        <Card className="overflow-hidden">
          {isMobile ? (
            // Mobile View - Cards
            <div className="p-4">
              {masterData.map((master, index) => (
                <MobileMasterCard key={index} master={master} index={index} />
              ))}
            </div>
          ) : (
            // Desktop View - Table
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Name</TableHead>
                    <TableHead>Login ID</TableHead>
                    <TableHead>P (%)</TableHead>
                    <TableHead>D. Count</TableHead>
                    <TableHead>B. Count</TableHead>
                    <TableHead>C. Count</TableHead>
                    <TableHead>Master</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Login Time</TableHead>
                    <TableHead>Login IP</TableHead>
                    <TableHead>Join Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {masterData.map((master, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{master.date}</TableCell>
                      <TableCell>{master.loginId}</TableCell>
                      <TableCell>{master.p}</TableCell>
                      <TableCell>{master.dCount}</TableCell>
                      <TableCell>{master.bCount}</TableCell>
                      <TableCell>{master.cCount}</TableCell>
                      <TableCell>{master.master}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {master.actions.map((action, idx) => (
                            <Button
                              key={idx}
                              size="sm"
                              className="h-6 w-6 p-0 text-xs bg-gray-600 hover:bg-gray-700 text-white"
                            >
                              {action}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{master.loginTime}</TableCell>
                      <TableCell>{master.loginIp}</TableCell>
                      <TableCell>{master.joinTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}