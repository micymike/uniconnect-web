import React from 'react'

const RentalDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Rental Listings</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Available Properties</h2>
            <p className="text-gray-300">No properties listed at the moment.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Featured Rentals</h2>
            <p className="text-gray-300">No featured rentals available.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RentalDashboard
