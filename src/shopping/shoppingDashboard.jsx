import React from 'react'

const ShoppingDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Student Marketplace</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Latest Listings</h2>
            <p className="text-gray-300">No items listed at the moment.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Featured Items</h2>
            <p className="text-gray-300">No featured items available.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingDashboard
