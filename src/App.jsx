import React, { useEffect, useRef, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import "./App.css"

// Import pages
import About from "./pages/About"
import Contact from "./pages/Contact"
import Terms from "./pages/Terms"

// Home page component
function Home() {
  const [isVisible, setIsVisible] = useState({
    hero: true,
    problem: false,
    features: false,
    benefits: false,
    preview: false,
    cta: false
  })
  
  const problemRef = useRef(null)
  const featuresRef = useRef(null)
  const benefitsRef = useRef(null)
  const previewRef = useRef(null)
  const ctaRef = useRef(null)
  // Track parallax offset for different speeds
  const [parallaxOffset, setParallaxOffset] = useState({
    slow: 0,
    medium: 0,
    fast: 0,
    opacity: 0.1
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === problemRef.current) {
              setIsVisible(prev => ({ ...prev, problem: true }))
            } else if (entry.target === featuresRef.current) {
              setIsVisible(prev => ({ ...prev, features: true }))
            } else if (entry.target === benefitsRef.current) {
              setIsVisible(prev => ({ ...prev, benefits: true }))
            } else if (entry.target === previewRef.current) {
              setIsVisible(prev => ({ ...prev, preview: true }))
            } else if (entry.target === ctaRef.current) {
              setIsVisible(prev => ({ ...prev, cta: true }))
            }
          }
        })
      },
      { threshold: 0.1 }
    )

    if (problemRef.current) observer.observe(problemRef.current)
    if (featuresRef.current) observer.observe(featuresRef.current)
    if (benefitsRef.current) observer.observe(benefitsRef.current)
    if (previewRef.current) observer.observe(previewRef.current)
    if (ctaRef.current) observer.observe(ctaRef.current)
    
    // Add parallax scrolling effect with fade out
    const handleScroll = () => {
      const scrollY = window.scrollY
      
      // Calculate background opacity - fade out completely after 300px of scroll
      const bgOpacity = Math.max(0, 0.1 - (scrollY / 300) * 0.1)
      
      // Log for debugging
      console.log("Scroll position:", scrollY, "Opacity:", bgOpacity)
      
      // Update parallax offsets
      setParallaxOffset({
        slow: scrollY * 0.05,
        medium: scrollY * 0.1,
        fast: scrollY * -0.15,
        opacity: bgOpacity
      })
      
      // Apply parallax effects via CSS variables
      document.documentElement.style.setProperty('--parallax-slow', `${scrollY * 0.05}px`)
      document.documentElement.style.setProperty('--parallax-medium', `${scrollY * 0.1}px`)
      document.documentElement.style.setProperty('--parallax-fast', `${scrollY * -0.15}px`)
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll)

    return () => {
      if (problemRef.current) observer.unobserve(problemRef.current)
      if (featuresRef.current) observer.unobserve(featuresRef.current)
      if (benefitsRef.current) observer.unobserve(benefitsRef.current)
      if (previewRef.current) observer.unobserve(previewRef.current)
      if (ctaRef.current) observer.unobserve(ctaRef.current)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="min-h-screen font-roboto bg-gradient-custom text-white">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 py-4 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Uni<span className="text-accent">Connect</span>
          </Link>
          <div className="flex gap-6">
            <Link to="/" className="text-white hover:text-accent transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-white hover:text-accent transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-white hover:text-accent transition-colors">
              Contact
            </Link>
            <Link to="/terms" className="text-white hover:text-accent transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 parallax-section">
        <div className={`z-10 fade-in-up parallax-element parallax-medium`}>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            Welcome to <span className="text-accent">UniConnect</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white">
            Transforming campus life through affordable meal sharing, simplified rental searches, and a vibrant student
            marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-accent hover:bg-accent-hover button-hover text-white px-8 py-3 text-lg rounded-md">
              Download App
            </button>
            <button className="border border-accent text-accent hover:bg-accent/10 button-hover px-8 py-3 text-lg rounded-md">
              Learn More ▼
            </button>
          </div>
        </div>

        <div className={`absolute inset-0 z-0 fade-in delay-500 parallax-element`} style={{
          backgroundImage: "url('images/connect1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: parallaxOffset.opacity,
          transform: `translateY(${parallaxOffset.slow}px)`,
          transition: "opacity 0.2s ease-out, transform 0.2s ease-out"
        }} />

        <div className={`absolute bottom-10 fade-in-up delay-1000 parallax-element parallax-fast`}>
          <div className="arrow-down">↓</div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section ref={problemRef} className="py-20 px-4 bg-gradient-to-br from-darker to-dark parallax-section">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 ${isVisible.problem ? 'fade-in-up parallax-element parallax-medium' : 'invisible'}`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">The Campus Challenge</h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
              Students face significant challenges with high meal costs, housing difficulties, and limited peer-to-peer
              commerce options.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className={`bg-darker p-8 rounded-xl ${isVisible.problem ? 'slide-in-left parallax-element parallax-slow' : 'invisible'}`}>
              <h3 className="text-2xl font-bold mb-4 text-accent">High Living Costs</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-accent">•</span>
                  <span>Campus meals can cost up to Ksh 250/= per day</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-accent">•</span>
                  <span>Cooking restrictions in hostels limit affordable options</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-accent">•</span>
                  <span>Finding affordable housing is time-consuming and challenging</span>
                </li>
              </ul>
            </div>

            <div className={`bg-darker p-8 rounded-xl ${isVisible.problem ? 'slide-in-right parallax-element parallax-fast' : 'invisible'}`}>
              <h3 className="text-2xl font-bold mb-4 text-accent">Untapped Opportunities</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-accent">•</span>
                  <span>Off-campus students can prepare meals for just Ksh 100/= per day</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-accent">•</span>
                  <span>Students have items to sell but lack a dedicated marketplace</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-accent">•</span>
                  <span>Potential for income generation through peer-to-peer services</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4 parallax-section" style={{
        background: "linear-gradient(135deg, #333333 0%, #111111 100%)"
      }}>
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 ${isVisible.features ? 'fade-in-up parallax-element parallax-medium' : 'invisible'}`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Solution</h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
              UniConnect offers three integrated services to transform campus life
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className={`bg-gradient-to-br from-darker to-dark p-8 rounded-xl hover:shadow-lg transition-all duration-300 border border-accent/20 ${isVisible.features ? 'fade-in-up delay-200 parallax-element parallax-slow' : 'invisible'}`}>
              <div className="bg-accent/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <span className="icon-utensils text-accent">🍽️</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Meal Sharing Network</h3>
              <p className="text-white mb-6">
                Connect with off-campus students offering affordable, home-cooked meals. Join meal pools or request
                specific dishes at reduced costs.
              </p>
              <div className="mt-auto">
                <button className="bg-accent hover:bg-accent-hover p-2 button-hover flex items-center text-white rounded-md">
                  Learn more <span className="ml-2 icon-arrow">→</span>
                </button>
              </div>
            </div>

            <div className={`bg-gradient-to-br from-darker to-dark p-8 rounded-xl hover:shadow-lg transition-all duration-300 border border-accent/20 ${isVisible.features ? 'fade-in-up delay-400 parallax-element parallax-medium' : 'invisible'}`}>
              <div className="bg-accent/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <span className="icon-home text-accent">🏠</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Rental Listings</h3>
              <p className="text-white mb-6">
                Find safe, affordable housing with our dedicated rental section. Search and filter properties based on
                your needs and connect directly with landlords.
              </p>
              <div className="mt-auto">
                <button className="bg-accent hover:bg-accent-hover p-2 button-hover flex items-center text-white rounded-md">
                  Learn more <span className="ml-2 icon-arrow">→</span>
                </button>
              </div>
            </div>

            <div className={`bg-gradient-to-br from-darker to-dark p-8 rounded-xl hover:shadow-lg transition-all duration-300 border border-accent/20 ${isVisible.features ? 'fade-in-up delay-600 parallax-element parallax-fast' : 'invisible'}`}>
              <div className="bg-accent/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <span className="icon-shopping text-accent">🛍️</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Student Marketplace</h3>
              <p className="text-white mb-6">
                Buy, sell, or advertise items and services in our in-app marketplace. Foster a circular economy and
                create income opportunities.
              </p>
              <div className="mt-auto">
                <button className="bg-accent hover:bg-accent-hover p-2 button-hover flex items-center text-white rounded-md">
                  Learn more <span className="ml-2 icon-arrow">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section ref={benefitsRef} className="py-20 px-4 parallax-section" style={{
        background: "linear-gradient(135deg, #222222 0%, #111111 100%)"
      }}>
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 ${isVisible.benefits ? 'fade-in-up parallax-element parallax-medium' : 'invisible'}`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">What You'll Gain</h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-white">
              UniConnect transforms campus life in multiple ways
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className={`flex gap-4 ${isVisible.benefits ? 'scale-in delay-100 parallax-element parallax-slow' : 'invisible'}`}>
              <div className="bg-accent/10 p-3 h-12 rounded-full flex items-center justify-center">
                <span className="text-accent font-bold">01</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Reduced Living Costs</h3>
                <p className="text-white">
                  Lower your daily expenses with access to affordable meals and cost-effective peer-to-peer
                  transactions.
                </p>
              </div>
            </div>

            <div className={`flex gap-4 ${isVisible.benefits ? 'scale-in delay-200 parallax-element parallax-medium' : 'invisible'}`}>
              <div className="bg-accent/10 p-3 h-12 rounded-full flex items-center justify-center">
                <span className="text-accent font-bold">02</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Income Generation</h3>
                <p className="text-white">
                  Earn money by selling meals, offering services, or selling goods through the platform.
                </p>
              </div>
            </div>

            <div className={`flex gap-4 ${isVisible.benefits ? 'scale-in delay-300 parallax-element parallax-fast' : 'invisible'}`}>
              <div className="bg-accent/10 p-3 h-12 rounded-full flex items-center justify-center">
                <span className="text-accent font-bold">03</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Better Food Quality & Access</h3>
                <p className="text-white">
                  Enjoy improved quality, variety, and accessibility of food options on campus.
                </p>
              </div>
            </div>

            <div className={`flex gap-4 ${isVisible.benefits ? 'scale-in delay-400 parallax-element parallax-slow' : 'invisible'}`}>
              <div className="bg-accent/10 p-3 h-12 rounded-full flex items-center justify-center">
                <span className="text-accent font-bold">04</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Simplified Housing Search</h3>
                <p className="text-white">
                  Find suitable and affordable off-campus accommodation with ease, connecting with legitimate landlords.
                </p>
              </div>
            </div>

            <div className={`flex gap-4 ${isVisible.benefits ? 'scale-in delay-500 parallax-element parallax-medium' : 'invisible'}`}>
              <div className="bg-accent/10 p-3 h-12 rounded-full flex items-center justify-center">
                <span className="text-accent font-bold">05</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Enhanced Community</h3>
                <p className="text-white">
                  Foster a stronger sense of community and collaboration among students through shared resources.
                </p>
              </div>
            </div>

            <div className={`flex gap-4 ${isVisible.benefits ? 'scale-in delay-600 parallax-element parallax-fast' : 'invisible'}`}>
              <div className="bg-accent/10 p-3 h-12 rounded-full flex items-center justify-center">
                <span className="text-accent font-bold">06</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Vibrant Campus Economy</h3>
                <p className="text-white">
                  Participate in a thriving intra-campus economy through the student marketplace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section ref={previewRef} className="py-20 px-4 parallax-section" style={{
        background: "linear-gradient(135deg, #222222 0%, #111111 100%)"
      }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className={`${isVisible.preview ? 'slide-in-left parallax-element parallax-medium' : 'invisible'}`}>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Experience UniConnect</h2>
              <p className="text-lg text-white mb-8">
                Our intuitive mobile app brings all these features together in one seamless experience. Download now and
                transform your campus life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-accent hover:bg-accent-hover button-hover text-white px-4 py-2 rounded-md">
                  Download for iOS
                </button>
                <button className="bg-accent hover:bg-accent-hover button-hover text-white px-4 py-2 rounded-md">
                  Download for Android
                </button>
              </div>
            </div>

            <div className={`relative h-[600px] flex justify-center ${isVisible.preview ? 'fade-in-up delay-200 parallax-element parallax-slow' : 'invisible'}`}>
              <div className="absolute transform rotate-[-8deg] left-[calc(50%-130px)]" style={{
                transition: "transform 0.5s ease-out"
              }}>
                <div className="relative w-[250px] h-[500px] rounded-[36px] overflow-hidden border-8 border-darker shadow-xl">
                  <img
                    src="images/connect.jpg"
                    alt="UniConnect App Screenshot - Meal Sharing"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute transform rotate-[8deg] left-[calc(50%-20px)] top-10 parallax-element parallax-fast" style={{
                transition: "transform 0.5s ease-out"
              }}>
                <div className="relative w-[250px] h-[500px] rounded-[36px] overflow-hidden border-8 border-darker shadow-xl">
                  <img
                    src="images/connect.jpg"
                    alt="UniConnect App Screenshot - Marketplace"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 px-4 bg-accent parallax-section">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`${isVisible.cta ? 'fade-in-up parallax-element parallax-medium' : 'invisible'}`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Ready to Transform Your Campus Experience?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of students already benefiting from UniConnect's innovative platform.
            </p>
            <button className="bg-white text-accent hover:bg-white/90 button-hover px-8 py-3 text-lg rounded-md">
              Download UniConnect Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-dark border-t border-darker">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <h3 className="text-2xl font-bold">
                Uni<span className="text-accent">Connect</span>
              </h3>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <Link to="/" className="text-white hover:text-accent transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-white hover:text-accent transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-white hover:text-accent transition-colors">
                Contact
              </Link>
              <Link to="/terms" className="text-white hover:text-accent transition-colors">
                Terms
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-darker text-center text-white">
            <p>© {new Date().getFullYear()} UniConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
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