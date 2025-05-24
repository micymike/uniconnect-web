import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Modules from './components/Modules'
import TechStack from './components/TechStack'
import CallToAction from './components/CallToAction'
import Footer from './components/Footer'
import About from './pages/About'
import Contact from './pages/Contact'
import Terms from './pages/Terms'

// Home page component
function Home() {
  return (
    <div className="min-h-screen bg-gradient-dark text-white">
      <Navbar />
      <Hero />
      <Features />
      <Modules />
      <TechStack />
      <CallToAction />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </Router>
  )
}

export default App
