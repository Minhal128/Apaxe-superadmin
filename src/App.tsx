import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Auth Pages
import SignIn from './pages/SignIn'

// Layout
import SuperAdminLayout from './components/SuperAdminLayout'

// Dashboard & Pages
import SuperAdminDashboard from './pages/SuperAdminDashboard'
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

function App() {
  return (
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
        {/* Auth Routes */}
        <Route path="/" element={<SignIn />} />

        {/* Super Admin Routes */}
        <Route path="/superadmin/dashboard" element={<SuperAdminLayout><SuperAdminDashboard /></SuperAdminLayout>} />
        <Route path="/superadmin/summary" element={<SuperAdminLayout><Summary /></SuperAdminLayout>} />
        <Route path="/superadmin/exposure-summary" element={<SuperAdminLayout><ExposureSummary /></SuperAdminLayout>} />
        
        {/* Super Admin Trading Routes */}
        <Route path="/superadmin/trading/trades" element={<SuperAdminLayout><Trades /></SuperAdminLayout>} />
        <Route path="/superadmin/trading/position" element={<SuperAdminLayout><Position /></SuperAdminLayout>} />
        <Route path="/superadmin/trading/margin-management" element={<SuperAdminLayout><MarginManagement /></SuperAdminLayout>} />
        <Route path="/superadmin/trading/manual-trade" element={<SuperAdminLayout><ManualTrade /></SuperAdminLayout>} />

        {/* Super Admin Forex Routes */}
        <Route path="/superadmin/forex/trade" element={<SuperAdminLayout><ForexTrade /></SuperAdminLayout>} />
        <Route path="/superadmin/forex/position" element={<SuperAdminLayout><ForexPosition /></SuperAdminLayout>} />
        <Route path="/superadmin/forex/summary" element={<SuperAdminLayout><ForexSummary /></SuperAdminLayout>} />
        <Route path="/superadmin/forex/margin-management" element={<SuperAdminLayout><ForexMarginManagement /></SuperAdminLayout>} />

        {/* Super Admin Users Routes */}
        <Route path="/superadmin/users/customer" element={<SuperAdminLayout><Customer /></SuperAdminLayout>} />
        <Route path="/superadmin/users/master" element={<SuperAdminLayout><Master /></SuperAdminLayout>} />
        <Route path="/superadmin/users/dealer" element={<SuperAdminLayout><Dealer /></SuperAdminLayout>} />
        <Route path="/superadmin/users/broker" element={<SuperAdminLayout><Broker /></SuperAdminLayout>} />
        <Route path="/superadmin/users/new-account" element={<SuperAdminLayout><NewAccount /></SuperAdminLayout>} />

        {/* Super Admin Utilities Routes */}
        <Route path="/superadmin/utilities/trade-logs" element={<SuperAdminLayout><TradeLogs /></SuperAdminLayout>} />
        <Route path="/superadmin/utilities/user-edit-log" element={<SuperAdminLayout><UserEditLog /></SuperAdminLayout>} />
        <Route path="/superadmin/utilities/deposit-ledger" element={<SuperAdminLayout><DepositLedger /></SuperAdminLayout>} />
        <Route path="/superadmin/utilities/cash-ledger-log" element={<SuperAdminLayout><CashLedgerLog /></SuperAdminLayout>} />
        <Route path="/superadmin/utilities/rejection-log" element={<SuperAdminLayout><RejectionLog /></SuperAdminLayout>} />
        <Route path="/superadmin/utilities/auto-square-off" element={<SuperAdminLayout><AutoSquareOff /></SuperAdminLayout>} />
        <Route path="/superadmin/utilities/bulk-trading" element={<SuperAdminLayout><BulkTrading /></SuperAdminLayout>} />

        {/* Super Admin Accounts Routes */}
        <Route path="/superadmin/accounts/ledger" element={<SuperAdminLayout><Ledger /></SuperAdminLayout>} />
        <Route path="/superadmin/accounts/cash-ledger" element={<SuperAdminLayout><CashLedger /></SuperAdminLayout>} />
        <Route path="/superadmin/accounts/cash-entry" element={<SuperAdminLayout><CashEntry /></SuperAdminLayout>} />
        <Route path="/superadmin/accounts/deposit-ledger" element={<SuperAdminLayout><AccountsDepositLedger /></SuperAdminLayout>} />
        <Route path="/superadmin/accounts/deposit-entry" element={<SuperAdminLayout><DepositEntry /></SuperAdminLayout>} />
        <Route path="/superadmin/accounts/jv" element={<SuperAdminLayout><JV /></SuperAdminLayout>} />
        <Route path="/superadmin/accounts/jv-ledger" element={<SuperAdminLayout><JVLedger /></SuperAdminLayout>} />

        {/* Super Admin Reports Routes */}
        <Route path="/superadmin/reports/trade-report" element={<SuperAdminLayout><TradeReport /></SuperAdminLayout>} />
        <Route path="/superadmin/reports/profit-loss" element={<SuperAdminLayout><ProfitLoss /></SuperAdminLayout>} />

        {/* Super Admin Settings Route */}
        <Route path="/superadmin/settings" element={<SuperAdminLayout><Settings /></SuperAdminLayout>} />

        {/* Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
