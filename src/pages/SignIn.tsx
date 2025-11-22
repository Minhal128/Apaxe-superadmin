import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-toastify'

export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password || !role) {
      toast.error('Please fill in all fields')
      return
    }
    
    toast.success('Login successful!')
    
    // Route based on selected role
    if (role === 'super-admin') {
      navigate('/superadmin/dashboard')
    } else {
      // Redirect to admin panel (different application)
      window.location.href = 'http://localhost:5174/dashboard' // Admin panel URL
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
          <img 
            src="/logo.png" 
            alt="ApexTrade Logo" 
            className="h-12 sm:h-16 w-auto mx-auto mb-3 sm:mb-4"
          />
        </div>
        
        <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 md:mb-8 px-2">
          APEX ADMIN SIGN IN
        </h1>
        
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8">
          <h2 className="text-gray-700 text-center mb-4 sm:mb-6 text-xs sm:text-sm md:text-base px-2">
            Please fill in your unique admin login details below
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
              />
            </div>

            <div>
              <label className="block text-gray-700 text-xs sm:text-sm mb-2">
                Role
              </label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super-admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="sub-admin">Sub Admin</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                </SelectContent>
              </Select>
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-10 sm:h-11 text-sm sm:text-base font-medium"
            >
              Sign In
            </Button>
          </form>
        </div>

        {/* Mobile bottom spacing */}
        <div className="h-4 sm:h-0"></div>
      </div>
    </div>
  )
}