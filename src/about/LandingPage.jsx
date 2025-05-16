import React from 'react'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen font-roboto text-white bg-gradient-to-br from-gray-800 to-black">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">ComradesHub</h1>
          <p className="text-xl text-gray-300">Your Complete Campus Experience Platform</p>
        </header>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Transform Your Campus Life</h2>
            <p className="text-gray-300 text-lg">
              ComradesHub is a comprehensive platform designed to improve your campus experience by
              addressing critical student needs through meal sharing, rental accommodation search,
              and a dynamic marketplace.
            </p>
          </div>
          <div className="grid gap-4">
            <button
              onClick={() => navigate('/meals')}
              className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
            >
              <h3 className="text-xl font-semibold mb-2">Meal Sharing Network</h3>
              <p className="text-sm text-gray-100">
                Join meal pools, purchase affordable meals, or share your culinary creations
              </p>
            </button>
            <button
              onClick={() => navigate('/rentals')}
              className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
            >
              <h3 className="text-xl font-semibold mb-2">Rental Listings</h3>
              <p className="text-sm text-gray-100">
                Find safe and affordable off-campus housing with verified landlords
              </p>
            </button>
            <button
              onClick={() => navigate('/shopping')}
              className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
            >
              <h3 className="text-xl font-semibold mb-2">Student Marketplace</h3>
              <p className="text-sm text-gray-100">
                Buy, sell, or advertise goods and services within the student community
              </p>
            </button>
          </div>
        </div>

        <section className="grid md:grid-cols-3 gap-8 text-center mb-16">
          <div className="p-6 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Reduced Living Costs</h3>
            <p className="text-gray-300">
              Access affordable meals and cost-effective peer-to-peer transactions
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Income Generation</h3>
            <p className="text-gray-300">
              Earn money by selling meals, offering services, or selling goods
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Strong Community</h3>
            <p className="text-gray-300">
              Connect with fellow students, share resources, and build networks
            </p>
          </div>
        </section>

        <footer className="text-center">
          <p className="text-gray-400">
            Join thousands of students already transforming their campus experience
          </p>
        </footer>
      </div>
    </div>
  )
}

export default LandingPage
