import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Import components
import LandingPage from './about/LandingPage'
import MealDashboard from './meal/foodDashboard'
import RentalDashboard from './rentals/rentalDashboard'
import ShoppingDashboard from './shopping/shoppingDashboard'

function App() {
  return (
    <Router>
      <div className="min-h-screen font-roboto">
        <Routes>
          {/* Redirect root to landing page */}
          <Route path="/" element={<Navigate to="/landing" replace />} />
          
          {/* Main routes */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/meals" element={<MealDashboard />} />
          <Route path="/rentals" element={<RentalDashboard />} />
          <Route path="/shopping" element={<ShoppingDashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
