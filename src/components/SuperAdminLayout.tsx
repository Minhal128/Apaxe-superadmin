import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  LayoutDashboard, 
  TrendingUp, 
  Settings as SettingsIcon, 
  Users, 
  Wallet, 
  DollarSign,
  FileText,
  Menu,
  ChevronDown,
  BarChart3,
  Target,
  Calculator,
  Edit3,
  PieChart,
  Gauge,
  LogOut
} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface SuperAdminLayoutProps {
  children: ReactNode
}

export default function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, logout, user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tradingOpen, setTradingOpen] = useState(true)
  const [forexOpen, setForexOpen] = useState(false)
  const [usersOpen, setUsersOpen] = useState(false)
  const [utilitiesOpen, setUtilitiesOpen] = useState(false)
  const [accountsOpen, setAccountsOpen] = useState(false)
  const [reportsOpen, setReportsOpen] = useState(false)

  // Auto-expand Trading menu if on a trading page
  useEffect(() => {
    if (location.pathname.startsWith('/trading')) {
      setTradingOpen(true)
    }
    if (location.pathname.startsWith('/forex')) {
      setForexOpen(true)
    }
    if (location.pathname.startsWith('/users')) {
      setUsersOpen(true)
    }
    if (location.pathname.startsWith('/utilities')) {
      setUtilitiesOpen(true)
    }
    if (location.pathname.startsWith('/accounts')) {
      setAccountsOpen(true)
    }
    if (location.pathname.startsWith('/reports')) {
      setReportsOpen(true)
    }
  }, [location.pathname])

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/signin')
    }
  }, [isAuthenticated, isLoading, navigate])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: TrendingUp, label: 'Market Watch', path: '/market-watch' },
    { icon: PieChart, label: 'Summary', path: '/summary' },
    { icon: Gauge, label: 'Exposure summary', path: '/exposure-summary' },
  ]

  const tradingSubItems = [
    { icon: BarChart3, label: 'Trades', path: '/trading/trades' },
    { icon: Target, label: 'Position', path: '/trading/position' },
    { icon: Calculator, label: 'Margin Mngmnt', path: '/trading/margin-management' },
    { icon: Edit3, label: 'Manual trade', path: '/trading/manual-trade' },
  ]

  const forexSubItems = [
    { icon: BarChart3, label: 'Trade', path: '/forex/trade' },
    { icon: Target, label: 'Position', path: '/forex/position' },
    { icon: PieChart, label: 'Summary', path: '/forex/summary' },
    { icon: Calculator, label: 'Margin mngmnt', path: '/forex/margin-management' },
  ]

  const usersSubItems = [
    { icon: Users, label: 'Customer', path: '/users/customer' },
    { icon: Users, label: 'Master', path: '/users/master' },
    { icon: Users, label: 'Dealer', path: '/users/dealer' },
    { icon: Users, label: 'Broker', path: '/users/broker' },
    { icon: Users, label: 'New account', path: '/users/new-account' },
  ]

  const utilitiesSubItems = [
    { icon: FileText, label: 'Trade logs', path: '/utilities/trade-logs' },
    { icon: FileText, label: 'User edit log', path: '/utilities/user-edit-log' },
    { icon: FileText, label: 'Deposit ledger', path: '/utilities/deposit-ledger' },
    { icon: FileText, label: 'Cash ledger log', path: '/utilities/cash-ledger-log' },
    { icon: FileText, label: 'Rejection log', path: '/utilities/rejection-log' },
    { icon: FileText, label: 'Auto-square off', path: '/utilities/auto-square-off' },
    { icon: FileText, label: 'Bulk-trading', path: '/utilities/bulk-trading' },
  ]

  const accountsSubItems = [
    { icon: DollarSign, label: 'Ledger', path: '/accounts/ledger' },
    { icon: DollarSign, label: 'Cash ledger', path: '/accounts/cash-ledger' },
    { icon: DollarSign, label: 'Cash entry', path: '/accounts/cash-entry' },
    { icon: DollarSign, label: 'Deposit ledger', path: '/accounts/deposit-ledger' },
    { icon: DollarSign, label: 'Deposit entry', path: '/accounts/deposit-entry' },
    { icon: DollarSign, label: 'JV', path: '/accounts/jv' },
    { icon: DollarSign, label: 'JV ledger', path: '/accounts/jv-ledger' },
  ]

  const reportsSubItems = [
    { icon: FileText, label: 'Trade Report', path: '/reports/trade-report' },
    { icon: FileText, label: 'Profit loss %', path: '/reports/profit-loss' },
  ]

  const bottomMenuItems = [
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
  ]

  const isActive = (path: string) => location.pathname === path
  const isTradingActive = () => location.pathname.startsWith('/trading')
  const isForexActive = () => location.pathname.startsWith('/forex')
  const isUsersActive = () => location.pathname.startsWith('/users')
  const isUtilitiesActive = () => location.pathname.startsWith('/utilities')
  const isAccountsActive = () => location.pathname.startsWith('/accounts')
  const isReportsActive = () => location.pathname.startsWith('/reports')

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-center">
          <img src="/logo.png" alt="Logo"  
          style={
            {
              // marginTop:"-50px" ,
              width:"100px",
              height:"80px",
              marginLeft:"-40px"
              
            }
          }/>
        </div>
        {/* User Info */}
        {user && (
          <div className="mt-3 text-center">
            <p className="text-sm font-medium text-gray-900">{user.username}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-1 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-green-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}

          {/* Trading Collapsible Menu */}
          <Collapsible open={tradingOpen} onOpenChange={setTradingOpen}>
            <CollapsibleTrigger asChild>
              <button
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isTradingActive()
                    ? 'bg-green-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 size={18} />
                  <span>Trading</span>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform ${tradingOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-1">
              {tradingSubItems.map((subItem) => {
                const SubIcon = subItem.icon
                return (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ml-3 ${
                      isActive(subItem.path)
                        ? 'bg-green-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <SubIcon size={16} />
                    <span>{subItem.label}</span>
                  </Link>
                )
              })}
            </CollapsibleContent>
          </Collapsible>

          {/* Forex Collapsible Menu */}
          <Collapsible open={forexOpen} onOpenChange={setForexOpen}>
            <CollapsibleTrigger asChild>
              <button
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isForexActive()
                    ? 'bg-green-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <DollarSign size={18} />
                  <span>Forex</span>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform ${forexOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-1">
              {forexSubItems.map((subItem) => {
                const SubIcon = subItem.icon
                return (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ml-3 ${
                      isActive(subItem.path)
                        ? 'bg-green-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <SubIcon size={16} />
                    <span>{subItem.label}</span>
                  </Link>
                )
              })}
            </CollapsibleContent>
          </Collapsible>

          {/* Users Collapsible Menu */}
          <Collapsible open={usersOpen} onOpenChange={setUsersOpen}>
            <CollapsibleTrigger asChild>
              <button
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isUsersActive()
                    ? 'bg-green-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users size={18} />
                  <span>Users</span>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform ${usersOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-1">
              {usersSubItems.map((subItem) => {
                const SubIcon = subItem.icon
                return (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ml-3 ${
                      isActive(subItem.path)
                        ? 'bg-green-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <SubIcon size={16} />
                    <span>{subItem.label}</span>
                  </Link>
                )
              })}
            </CollapsibleContent>
          </Collapsible>

          {/* Utilities Collapsible Menu */}
          <Collapsible open={utilitiesOpen} onOpenChange={setUtilitiesOpen}>
            <CollapsibleTrigger asChild>
              <button
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isUtilitiesActive()
                    ? 'bg-green-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Wallet size={18} />
                  <span>Utilities</span>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform ${utilitiesOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-1">
              {utilitiesSubItems.map((subItem) => {
                const SubIcon = subItem.icon
                return (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ml-3 ${
                      isActive(subItem.path)
                        ? 'bg-green-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <SubIcon size={16} />
                    <span>{subItem.label}</span>
                  </Link>
                )
              })}
            </CollapsibleContent>
          </Collapsible>

          {/* Accounts Collapsible Menu */}
          <Collapsible open={accountsOpen} onOpenChange={setAccountsOpen}>
            <CollapsibleTrigger asChild>
              <button
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isAccountsActive()
                    ? 'bg-green-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <DollarSign size={18} />
                  <span>Accounts</span>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform ${accountsOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-1">
              {accountsSubItems.map((subItem) => {
                const SubIcon = subItem.icon
                return (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ml-3 ${
                      isActive(subItem.path)
                        ? 'bg-green-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <SubIcon size={16} />
                    <span>{subItem.label}</span>
                  </Link>
                )
              })}
            </CollapsibleContent>
          </Collapsible>

          {/* Reports Collapsible Menu */}
          <Collapsible open={reportsOpen} onOpenChange={setReportsOpen}>
            <CollapsibleTrigger asChild>
              <button
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isReportsActive()
                    ? 'bg-green-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} />
                  <span>Reports</span>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform ${reportsOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-1">
              {reportsSubItems.map((subItem) => {
                const SubIcon = subItem.icon
                return (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ml-3 ${
                      isActive(subItem.path)
                        ? 'bg-green-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <SubIcon size={16} />
                    <span>{subItem.label}</span>
                  </Link>
                )
              })}
            </CollapsibleContent>
          </Collapsible>

          {/* Bottom Menu Items */}
          {bottomMenuItems.filter(item => item.label !== 'Users').map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-green-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100 mt-2"
          >
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </nav>
      </ScrollArea>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-56 lg:flex-col">
        <div className="flex grow flex-col overflow-y-auto bg-white border-r border-gray-200">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-md"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-56 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-56">
        {/* Page Content */}
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
