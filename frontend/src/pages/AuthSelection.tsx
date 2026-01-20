import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Facebook, Chrome, CheckCircle2 } from 'lucide-react'

const AuthSelection: React.FC = () => {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState<'login' | 'register'>('register')

  const handleBackClick = () => {
    navigate('/')
  }

  const handleEmailRegister = () => {
    navigate('/auth/register')
  }

  const handleLogin = () => {
    navigate('/auth/login')
  }

  const handlePendingMethod = (method: string) => {
    console.log(`${method} login/register coming soon`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex flex-col">
      {/* Header with back button */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center">
        {/* Page title and subtitle */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {selectedTab === 'register' ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            {selectedTab === 'register' 
              ? 'Join our community to find meaningful connections and support local businesses'
              : 'Sign in to access your profile, matches, and upcoming date night packages'
            }
          </p>
        </div>

        {/* Login/Register tabs */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-1 mb-8 shadow-sm">
          <div className="flex">
            <button
              onClick={() => setSelectedTab('register')}
              className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all duration-300 ${
                selectedTab === 'register'
                  ? 'bg-white text-primary-600 shadow-md transform scale-105'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Create Account
            </button>
            <button
              onClick={() => setSelectedTab('login')}
              className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all duration-300 ${
                selectedTab === 'login'
                  ? 'bg-white text-primary-600 shadow-md transform scale-105'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Log In
            </button>
          </div>
        </div>

        {/* Authentication methods */}
        <div className="w-full max-w-md">
          {selectedTab === 'register' ? (
            /* Register methods */
            <div className="space-y-4">
              {/* Email registration (available) */}
              <button
                onClick={handleEmailRegister}
                className="w-full bg-white border border-gray-200 rounded-xl py-4 px-6 flex items-center justify-center gap-3 text-gray-700 hover:bg-gray-50 hover:border-primary-200 hover:text-primary-600 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Mail className="h-5 w-5" />
                <span className="font-medium">Continue with Email</span>
                <div className="ml-auto">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
              </button>

              {/* Phone registration (pending) */}
              <button
                onClick={() => handlePendingMethod('Phone')}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-6 flex items-center justify-center gap-3 text-gray-400 cursor-not-allowed opacity-60"
              >
                <Phone className="h-5 w-5" />
                <span className="font-medium">Continue with Phone</span>
                <div className="ml-auto">
                  <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
              </button>

              {/* Facebook registration (pending) */}
              <button
                onClick={() => handlePendingMethod('Facebook')}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-6 flex items-center justify-center gap-3 text-gray-400 cursor-not-allowed opacity-60"
              >
                <Facebook className="h-5 w-5" />
                <span className="font-medium">Continue with Facebook</span>
                <div className="ml-auto">
                  <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
              </button>

              {/* Google registration (pending) */}
              <button
                onClick={() => handlePendingMethod('Google')}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-6 flex items-center justify-center gap-3 text-gray-400 cursor-not-allowed opacity-60"
              >
                <Chrome className="h-5 w-5" />
                <span className="font-medium">Continue with Google</span>
                <div className="ml-auto">
                  <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
              </button>
            </div>
          ) : (
            /* Login methods */
            <div className="space-y-4">
              {/* Email login (available) */}
              <button
                onClick={handleLogin}
                className="w-full bg-white border border-gray-200 rounded-xl py-4 px-6 flex items-center justify-center gap-3 text-gray-700 hover:bg-gray-50 hover:border-primary-200 hover:text-primary-600 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <Mail className="h-5 w-5" />
                <span className="font-medium">Continue with Email</span>
                <div className="ml-auto">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
              </button>

              {/* Phone login (pending) */}
              <button
                onClick={() => handlePendingMethod('Phone')}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-6 flex items-center justify-center gap-3 text-gray-400 cursor-not-allowed opacity-60"
              >
                <Phone className="h-5 w-5" />
                <span className="font-medium">Continue with Phone</span>
                <div className="ml-auto">
                  <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
              </button>

              {/* Facebook login (pending) */}
              <button
                onClick={() => handlePendingMethod('Facebook')}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-6 flex items-center justify-center gap-3 text-gray-400 cursor-not-allowed opacity-60"
              >
                <Facebook className="h-5 w-5" />
                <span className="font-medium">Continue with Facebook</span>
                <div className="ml-auto">
                  <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
              </button>

              {/* Google login (pending) */}
              <button
                onClick={() => handlePendingMethod('Google')}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-6 flex items-center justify-center gap-3 text-gray-400 cursor-not-allowed opacity-60"
              >
                <Chrome className="h-5 w-5" />
                <span className="font-medium">Continue with Google</span>
                <div className="ml-auto">
                  <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full">
                    Coming Soon
                  </span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Terms and conditions */}
        <div className="mt-10 text-center text-sm text-gray-500 max-w-md">
          <p>
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-primary-600 hover:underline font-medium">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary-600 hover:underline font-medium">
              Privacy Policy
            </a>
          </p>
          <p className="mt-2 text-xs text-gray-400">
            We'll use your information to create your profile and match you with compatible singles
          </p>
        </div>
      </main>

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-1000"></div>
      </div>
    </div>
  )
}

export default AuthSelection
