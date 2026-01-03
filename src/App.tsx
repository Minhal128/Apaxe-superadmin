import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Auth Context
import { AuthProvider } from './contexts/AuthContext'

// Auth Pages
import SignIn from './pages/SignIn'

// Layout
import SuperAdminLayout from './components/SuperAdminLayout'

// Dashboard & Pages
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import MarketWatch from './pages/MarketWatch'
import Summary from './pages/Summary'
import ExposureSummary from './pages/ExposureSummary'

// Trading Pages
import Trades from './pages/trading/Trades'
import Position from './pages/trading/Position'
import MarginManagement from './pages/trading/MarginManagement'
import ManualTrade from './pages/trading/ManualTrade'

// Forex Pages
import ForexTrade from './pages/forex/Trade'
import ForexPosition from './pages/forex/Position'
import ForexSummary from './pages/forex/Summary'
import ForexMarginManagement from './pages/forex/MarginManagement'

// Users Pages
import Customer from './pages/users/Customer'
import Master from './pages/users/Master'
import Dealer from './pages/users/Dealer'
import Broker from './pages/users/Broker'
import NewAccount from './pages/users/NewAccount'

// Utilities Pages
import TradeLogs from './pages/utilities/TradeLogs'
import UserEditLog from './pages/utilities/UserEditLog'
import DepositLedger from './pages/utilities/DepositLedger'
import CashLedgerLog from './pages/utilities/CashLedgerLog'
import RejectionLog from './pages/utilities/RejectionLog'
import AutoSquareOff from './pages/utilities/AutoSquareOff'
import BulkTrading from './pages/utilities/BulkTrading'

// Accounts Pages
import Ledger from './pages/accounts/Ledger'
import CashLedger from './pages/accounts/CashLedger'
import CashEntry from './pages/accounts/CashEntry'
import AccountsDepositLedger from './pages/accounts/DepositLedger'
import DepositEntry from './pages/accounts/DepositEntry'
import JV from './pages/accounts/JV'
import JVLedger from './pages/accounts/JVLedger'

// Reports Pages
import TradeReport from './pages/reports/TradeReport'
import ProfitLoss from './pages/reports/ProfitLoss'

// Settings Page
import Settings from './pages/Settings'

// Instruments Management
import InstrumentsManagement from './pages/InstrumentsManagement'

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<SuperAdminLayout><Outlet /></SuperAdminLayout>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="market-watch" element={<MarketWatch />} />
            <Route path="instruments" element={<InstrumentsManagement />} />
            <Route path="summary" element={<Summary />} />
            <Route path="exposure-summary" element={<ExposureSummary />} />
            
            {/* Trading Routes */}
            <Route path="trading/trades" element={<Trades />} />
            <Route path="trading/position" element={<Position />} />
            <Route path="trading/margin-management" element={<MarginManagement />} />
            <Route path="trading/manual-trade" element={<ManualTrade />} />
            
            {/* Forex Routes */}
            <Route path="forex/trade" element={<ForexTrade />} />
            <Route path="forex/position" element={<ForexPosition />} />
            <Route path="forex/summary" element={<ForexSummary />} />
            <Route path="forex/margin-management" element={<ForexMarginManagement />} />
            
            {/* Users Routes */}
            <Route path="users/customer" element={<Customer />} />
            <Route path="users/master" element={<Master />} />
            <Route path="users/dealer" element={<Dealer />} />
            <Route path="users/broker" element={<Broker />} />
            <Route path="users/new-account" element={<NewAccount />} />
            
            {/* Utilities Routes */}
            <Route path="utilities/trade-logs" element={<TradeLogs />} />
            <Route path="utilities/user-edit-log" element={<UserEditLog />} />
            <Route path="utilities/deposit-ledger" element={<DepositLedger />} />
            <Route path="utilities/cash-ledger-log" element={<CashLedgerLog />} />
            <Route path="utilities/rejection-log" element={<RejectionLog />} />
            <Route path="utilities/auto-square-off" element={<AutoSquareOff />} />
            <Route path="utilities/bulk-trading" element={<BulkTrading />} />
            
            {/* Accounts Routes */}
            <Route path="accounts/ledger" element={<Ledger />} />
            <Route path="accounts/cash-ledger" element={<CashLedger />} />
            <Route path="accounts/cash-entry" element={<CashEntry />} />
            <Route path="accounts/deposit-ledger" element={<AccountsDepositLedger />} />
            <Route path="accounts/deposit-entry" element={<DepositEntry />} />
            <Route path="accounts/jv" element={<JV />} />
            <Route path="accounts/jv-ledger" element={<JVLedger />} />
            
            {/* Reports Routes */}
            <Route path="reports/trade-report" element={<TradeReport />} />
            <Route path="reports/profit-loss" element={<ProfitLoss />} />
            
            {/* Settings Route */}
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
