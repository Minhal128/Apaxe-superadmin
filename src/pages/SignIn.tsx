import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../contexts/AuthContext'

export default function SignIn() {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState('admin@apextrade.com')
  const [password, setPassword] = useState('admin123456')
  const [showPassword, setShowPassword] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    
    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch (error) {
      // Error is already handled in AuthContext
      console.error('Login failed:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary to-primary/80 p-4 sm:p-6 relative overflow-hidden">
      {/* Decorative Circles - Responsive */}
      <div className="absolute top-0 left-0 w-32 h-32 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-[#B3E7D7] rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2 blur-2xl sm:blur-3xl"></div>
      <div className="absolute top-5 right-2 sm:top-10 sm:right-5 md:top-20 md:right-10 w-16 h-16 sm:w-32 sm:h-32 md:w-64 md:h-64 bg-[#B3E7D7] rounded-full opacity-15 blur-xl sm:blur-2xl"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 sm:w-80 sm:h-80 md:w-[500px] md:h-[500px] bg-[#B3E7D7] rounded-full opacity-20 translate-x-1/4 translate-y-1/4 sm:translate-x-1/3 sm:translate-y-1/3 blur-2xl sm:blur-3xl"></div>
      <div className="absolute bottom-5 left-5 sm:bottom-10 sm:left-10 md:bottom-20 md:left-20 w-16 h-16 sm:w-32 sm:h-32 md:w-48 md:h-48 bg-[#B3E7D7] rounded-full opacity-10 blur-lg sm:blur-xl"></div>
      
      <div className="w-full max-w-sm sm:max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          {/* <img 
            src="/logo.png" 
            alt="ApexTrade Logo" 
            className="h-12 sm:h-16 w-auto mx-auto mb-3 sm:mb-4"
          /> */}
        </div>
        
        <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 md:mb-8 px-2">
          APEX SUPERADMIN SIGN IN
        </h1>
        
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8">
          <h2 className="text-gray-700 text-center mb-4 sm:mb-6 text-xs sm:text-sm md:text-base px-2">
            Please fill in your superadmin login details below
          </h2>
          
          <form onSubmit={handleSignIn} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-gray-700 text-xs sm:text-sm mb-2">
                Email address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-10 sm:h-11 text-sm sm:text-base"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-xs sm:text-sm mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-10 sm:h-11 text-sm sm:text-base pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showPassword ? 
                    <EyeOff size={18} className="sm:w-5 sm:h-5" /> : 
                    <Eye size={18} className="sm:w-5 sm:h-5" />
                  }
                </button>
              </div>
              <div className="text-right mt-2">
                <button
                  type="button"
                  className="text-gray-500 text-xs sm:text-sm hover:text-gray-700"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-10 sm:h-11 text-sm sm:text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Test Credentials Info */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              <strong>Test Credentials:</strong><br />
              Email: admin@apextrade.com<br />
              Password: admin123456
            </p>
          </div>
        </div>

        {/* Mobile bottom spacing */}
        <div className="h-4 sm:h-0"></div>
      </div>
    </div>
  )
}