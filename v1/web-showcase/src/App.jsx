import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Modules from './components/Modules'
import TechStack from './components/TechStack'
import CallToAction from './components/CallToAction'
import Footer from './components/Footer'

function App() {
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

export default App
