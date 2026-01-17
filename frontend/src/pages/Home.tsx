import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Utensils, Calendar } from 'lucide-react'

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Date Nights That{' '}
              <span className="text-gradient">Invest in Your Community</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Skip the endless swiping. Pre-purchase dinner packages from local restaurants 
              and meet compatible singles who are ready for real-world dates.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link 
                to="/register" 
                className="btn-primary text-lg px-8 py-3"
              >
                Get Started
              </Link>
              <Link 
                to="/login" 
                className="btn-secondary text-lg px-8 py-3"
              >
                Sign In
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-primary-100 rounded-lg mr-4">
                    <Heart className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Curated Matches</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Availability-first matching ensures you only see compatible singles 
                  who are ready to meet.
                </p>
              </div>

              <div className="card p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-primary-100 rounded-lg mr-4">
                    <Utensils className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Local Restaurants</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Support neighborhood businesses with prepaid dinner packages 
                  and guaranteed reservations.
                </p>
              </div>

              <div className="card p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-primary-100 rounded-lg mr-4">
                    <Calendar className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">No More Waiting</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Commit to a time window and experience type, then instantly 
                  see who's available to meet.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-100 rounded-lg p-4">
                  <img 
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=300&fit=crop" 
                    alt="Restaurant" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <p className="mt-2 text-sm font-medium">Café Luna</p>
                  <p className="text-xs text-gray-500">Italian • $50</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <img 
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=300&fit=crop" 
                    alt="Restaurant" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <p className="mt-2 text-sm font-medium">Bistro Verde</p>
                  <p className="text-xs text-gray-500">Mediterranean • $45</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Available Time Slots</span>
                  <span className="text-xs text-gray-500">Next 7 days</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button className="text-xs bg-white px-2 py-1 rounded border">Thu 6-9pm</button>
                  <button className="text-xs bg-white px-2 py-1 rounded border">Fri 7-10pm</button>
                  <button className="text-xs bg-white px-2 py-1 rounded border">Sat 5-8pm</button>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  150+ users in your area
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">10K+</div>
              <div className="text-gray-600">First dates completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Local restaurants partnered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600">Show-up rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">4.8★</div>
              <div className="text-gray-600">Average rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
