import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Utensils, Calendar, Star, ArrowRight, CheckCircle, ChevronRight } from 'lucide-react'

const Home: React.FC = () => {
  const navigate = useNavigate()

  const handleGetStartedClick = () => {
    navigate('/auth')
  }

  const handleLoginClick = () => {
    navigate('/auth/login')
  }

  // Smooth scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section')
      sections.forEach(section => {
        const rect = section.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.85) {
          section.classList.add('animate-fade-in')
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-indigo-100 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                Revolutionizing dating while supporting local businesses
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Date Nights That{' '}
                <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                  Invest in Your Community
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                Skip the endless swiping. Pre-purchase dinner packages from local restaurants 
                and meet compatible singles who are ready for real-world dates.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStartedClick}
                  className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg shadow-primary-200 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
                <button
                  onClick={handleLoginClick}
                  className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-primary-600 font-bold py-4 px-8 rounded-xl text-lg shadow-lg shadow-gray-200 border-2 border-primary-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Login
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                <div>
                  <div className="text-2xl font-bold text-primary-600">10K+</div>
                  <div className="text-sm text-gray-600">First dates completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">500+</div>
                  <div className="text-sm text-gray-600">Local restaurants</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">95%</div>
                  <div className="text-sm text-gray-600">Show-up rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">4.8★</div>
                  <div className="text-sm text-gray-600">Average rating</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
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
                    <button className="text-xs bg-white px-2 py-1 rounded border hover:bg-primary-50 hover:border-primary-200 transition-colors">
                      Thu 6-9pm
                    </button>
                    <button className="text-xs bg-white px-2 py-1 rounded border hover:bg-primary-50 hover:border-primary-200 transition-colors">
                      Fri 7-10pm
                    </button>
                    <button className="text-xs bg-white px-2 py-1 rounded border hover:bg-primary-50 hover:border-primary-200 transition-colors">
                      Sat 5-8pm
                    </button>
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
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Platform</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We've reimagined dating to focus on what matters most - real connections and supporting local businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl hover:bg-primary-50 transition-colors duration-300 transform hover:-translate-y-2">
              <div className="p-4 bg-primary-100 rounded-xl w-fit mb-6">
                <Heart className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Curated Matches</h3>
              <p className="text-gray-600">
                Availability-first matching ensures you only see compatible singles who are ready to meet.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl hover:bg-primary-50 transition-colors duration-300 transform hover:-translate-y-2">
              <div className="p-4 bg-primary-100 rounded-xl w-fit mb-6">
                <Utensils className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Local Restaurants</h3>
              <p className="text-gray-600">
                Support neighborhood businesses with prepaid dinner packages and guaranteed reservations.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl hover:bg-primary-50 transition-colors duration-300 transform hover:-translate-y-2">
              <div className="p-4 bg-primary-100 rounded-xl w-fit mb-6">
                <Calendar className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">No More Waiting</h3>
              <p className="text-gray-600">
                Commit to a time window and experience type, then instantly see who's available to meet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of singles who have found meaningful connections through our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "I've been on more meaningful dates in 3 months than I had in 3 years on other apps. 
                The local restaurant focus makes each date feel special."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" 
                  alt="Sarah Johnson" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-bold">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">32 • Chicago</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Finally, a dating app that values real connections over endless swiping. 
                The pre-purchased packages take the pressure off first dates."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
                  alt="Mike Chen" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-bold">Mike Chen</p>
                  <p className="text-sm text-gray-500">35 • New York</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "As a restaurant owner, I love that this platform drives business to local spots. 
                It's a win-win for everyone!"
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" 
                  alt="Emma Davis" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-bold">Emma Davis</p>
                  <p className="text-sm text-gray-500">28 • Austin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Join our community of singles who are ready for real dates and meaningful connections.
          </p>
          <button
            onClick={handleGetStartedClick}
            className="inline-flex items-center justify-center bg-white hover:bg-gray-100 text-primary-600 font-bold py-4 px-8 rounded-xl text-lg shadow-lg shadow-primary-200 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Get Started
            <ChevronRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">LSDN</h3>
              <p className="text-gray-400">
                Dating that supports local businesses and creates real connections.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><a href="/auth" className="text-gray-400 hover:text-white transition-colors">Get Started</a></li>
                <li><a href="/auth/login" className="text-gray-400 hover:text-white transition-colors">Login</a></li>
                <li><a href="/packages" className="text-gray-400 hover:text-white transition-colors">Packages</a></li>
                <li><a href="/discover" className="text-gray-400 hover:text-white transition-colors">Discover</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LSDN. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        .text-gradient {
          background: linear-gradient(to right, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .animate-fade-in {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default Home
