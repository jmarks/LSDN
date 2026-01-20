import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Utensils, Calendar, Users, MessageSquare, User, LogOut, Menu, X, ShoppingCart, Gift, CheckCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useOnboarding } from '../hooks/useOnboarding'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth()
  const { state, steps } = useOnboarding()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [purchasedExperiences, setPurchasedExperiences] = useState(0)
  const [inviteStatus, setInviteStatus] = useState('pending')

  useEffect(() => {
    // Load cart count from local storage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      const cartItems = JSON.parse(savedCart)
      const count = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
      setCartCount(count)
    }

    // Load purchased experiences count (mock data for now)
    setPurchasedExperiences(2)

    // Load invite status (mock data for now)
    setInviteStatus('pending')
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinks = [
    { name: 'Discover', path: '/discover', icon: Heart },
    { name: 'Packages', path: '/packages', icon: Utensils },
    { name: 'Matches', path: '/matches', icon: Users },
    { name: 'Bookings', path: '/bookings', icon: Calendar },
    { name: 'Messages', path: '/messages', icon: MessageSquare },
    { name: 'Profile', path: '/profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Logo and Desktop Navigation */}
            <div className="flex items-center">
              <Link to="/discover" className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">LSDN</span>
              </Link>
              
              {/* Desktop Navigation Links */}
              <div className="hidden md:ml-8 md:flex md:space-x-1">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="group flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {link.name}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Cart Icon */}
              <Link
                to="/cart"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors relative"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                <span className="hidden md:inline">Cart</span>
              </Link>

              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-gray-700">Welcome, {user?.firstName || user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {link.name}
                  </Link>
                )
              })}
              <div className="pt-4 border-t border-gray-200">
                <div className="px-3 py-2">
                  <p className="text-sm text-gray-700">Welcome, {user?.firstName || user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Status Dashboard */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Purchased Experiences */}
            <div className="flex items-center space-x-2">
              <Gift className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-gray-700">
                Purchased Experiences: <span className="font-bold">{purchasedExperiences}</span>
              </span>
            </div>

            {/* Invite Status */}
            <div className="flex items-center space-x-2">
              <CheckCircle className={`h-5 w-5 ${inviteStatus === 'accepted' ? 'text-green-500' : 'text-yellow-500'}`} />
              <span className="text-sm font-medium text-gray-700">
                Invite Status: <span className="font-bold capitalize">{inviteStatus}</span>
              </span>
            </div>

            {/* Onboarding Progress (if not complete) */}
            {!state.isOnboardingComplete && (
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <span>Onboarding: {state.completedSteps.length} of {steps.filter(step => step.isRequired).length} steps</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-lg">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">LSDN</span>
              </div>
              <p className="text-gray-600 text-sm">
                Date nights that invest in your community. Connect with compatible singles while supporting local restaurants.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Platform
              </h3>
              <ul className="space-y-2">
                <li><Link to="/discover" className="text-gray-600 hover:text-gray-900 text-sm">Discover</Link></li>
                <li><Link to="/packages" className="text-gray-600 hover:text-gray-900 text-sm">Packages</Link></li>
                <li><Link to="/matches" className="text-gray-600 hover:text-gray-900 text-sm">Matches</Link></li>
                <li><Link to="/bookings" className="text-gray-600 hover:text-gray-900 text-sm">Bookings</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Support
              </h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Safety Tips</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Contact
              </h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>support@lsdn.app</li>
                <li>1-800-LSDN-APP</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>© 2024 Local Singles Date Night. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
