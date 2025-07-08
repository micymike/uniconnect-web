import React, { useEffect, useRef, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Terms from "./pages/Terms"
import Privacy from "./pages/Privacy"
import Admin from "./pages/Admin"
import Reset from "./pages/Reset"
import Footer from "./components/Footer"

// Floating particles component
const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-accent/10 animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${Math.random() * 10 + 10}s`
          }}
        />
      ))}
    </div>
  )
}

// Magnetic button component
const MagneticButton = ({ children, className, onClick, comingSoon = false, ...props }) => {
  const buttonRef = useRef(null)
  const [showTooltip, setShowTooltip] = useState(false)
  
  const handleMouseMove = (e) => {
    const button = buttonRef.current
    if (!button) return
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`
  }
  
  const handleMouseLeave = () => {
    if (buttonRef.current) {
      buttonRef.current.style.transform = 'translate(0px, 0px) scale(1)'
    }
    setShowTooltip(false)
  }
  
  const handleMouseEnter = () => {
    if (comingSoon) {
      setShowTooltip(true)
    }
  }
  
  const handleButtonClick = (e) => {
    if (comingSoon) {
      e.preventDefault()
      return
    }
    
    if (onClick) {
      onClick(e)
    }
  }
  
  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        className={`magnetic-button ${className} ${comingSoon ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleButtonClick}
        {...props}
      >
        {children}
      </button>
      
      {comingSoon && showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 bg-black/80 backdrop-blur-sm text-white text-sm py-2 px-4 rounded-lg shadow-lg z-50 whitespace-nowrap animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-accent">🚧</span> Coming Soon!
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-black/80"></div>
        </div>
      )}
    </div>
  )
}

// Tilt card component
const TiltCard = ({ children, className }) => {
  const cardRef = useRef(null)
  
  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  }
  
  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    }
  }
  
  return (
    <div
      ref={cardRef}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}

// Main landing page component
function HomePage() {
  const [isVisible, setIsVisible] = useState({
    hero: true,
    problem: false,
    features: false,
    benefits: false,
    preview: false,
    cta: false
  })
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
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
    ultra: 0,
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
    
    // Enhanced parallax scrolling effect
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // Calculate scroll progress
      const progress = scrollY / (documentHeight - windowHeight)
      setScrollProgress(progress)
      
      // Calculate background opacity - fade out completely after 400px of scroll
      const bgOpacity = Math.max(0, 0.15 - (scrollY / 400) * 0.15)
      
      // Enhanced parallax offsets with more variety
      setParallaxOffset({
        slow: scrollY * 0.02,
        medium: scrollY * 0.08,
        fast: scrollY * -0.12,
        ultra: scrollY * -0.2,
        opacity: bgOpacity
      })
    }
    
    // Mouse tracking for interactive effects
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      if (problemRef.current) observer.unobserve(problemRef.current)
      if (featuresRef.current) observer.unobserve(featuresRef.current)
      if (benefitsRef.current) observer.unobserve(benefitsRef.current)
      if (previewRef.current) observer.unobserve(previewRef.current)
      if (ctaRef.current) observer.unobserve(ctaRef.current)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="min-h-screen font-sans bg-gradient-custom text-white overflow-x-hidden">
      <FloatingParticles />
      
      {/* Scroll Progress Indicator */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-accent to-orange-600 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress * 100}%` }}
      />
      
      {/* Mouse Follower */}
      <div 
        className="fixed pointer-events-none z-40 w-6 h-6 rounded-full bg-accent/30 blur-sm transition-all duration-300"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Enhanced Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-4 backdrop-blur-lg bg-black/20 border-b border-white/10 transition-all duration-500">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold group cursor-pointer">
            <span className="group-hover:animate-pulse text-white">Uni</span>
            <span className="text-accent group-hover:text-orange-400 transition-colors duration-300">Connect</span>
          </div>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden text-white focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6">
            {[
              { text: "Home", path: "/" },
              { text: "About", path: "/about" },
              { text: "Contact", path: "/contact" },
              { text: "Terms", path: "/terms" },
              { text: "Privacy", path: "/privacy" },
            ].map((link, index) => (
              <Link 
                to={link.path}
                key={link.text}
                className="relative text-white hover:text-accent transition-all duration-300 nav-link group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {link.text}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-lg mt-2 py-4 px-4 rounded-lg border border-gray-800 animate-fade-in-down">
            {[
              { text: "Home", path: "/" },
              { text: "About", path: "/about" },
              { text: "Contact", path: "/contact" },
              { text: "Terms", path: "/terms" },
              { text: "Privacy", path: "/privacy" },
            ].map((link) => (
              <Link 
                to={link.path}
                key={link.text}
                className="block py-2 text-white hover:text-accent transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.text}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section with Advanced Effects */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 parallax-section overflow-hidden">
        {/* Animated Background Layers */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-accent/5 to-orange-500/5"
            style={{
              transform: `translateY(${parallaxOffset.ultra}px) rotate(${scrollProgress * 5}deg)`,
              transition: "transform 0.1s ease-out"
            }}
          />
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
              transform: `translateY(${parallaxOffset.medium}px)`,
            }}
          />
        </div>

        <div className="z-10 hero-content">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 text-white hero-title">
            <span className="inline-block animate-float-delayed">Welcome</span>{' '}
            <span className="inline-block animate-float-delayed-2">to</span>{' '}
            <span className="text-accent inline-block animate-float-delayed-3 glow-text">UniConnect</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-white hero-subtitle">
            Transforming campus life through 
            <span className="text-accent font-semibold"> affordable meal sharing</span>, 
            <span className="text-orange-300 font-semibold"> simplified rental searches</span>, and a 
            <span className="text-orange-200 font-semibold"> vibrant student marketplace</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center hero-buttons">
            <MagneticButton 
              className="bg-accent hover:bg-accent-hover text-white px-8 py-4 text-lg rounded-xl shadow-2xl hover:shadow-accent/25 transition-all duration-500 transform hover:scale-105 glow-button"
              onClick={() => {
                const link = document.createElement('a');
                link.href = 'https://expo.dev/artifacts/eas/8292fc1b-0045-4bf6-a47f-99dc59a41d18.apk';
                link.download = 'UniConnect.apk';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <span className="flex items-center gap-2">
                📱 Download App
                <span className="animate-bounce">→</span>
              </span>
            </MagneticButton>
            <MagneticButton className="border border-accent/50 backdrop-blur-sm bg-white/5 text-white hover:bg-accent/20 px-8 py-4 text-lg rounded-xl transition-all duration-500 hover:border-accent">
              <span className="flex items-center gap-2">
                ✨ Learn More
                <span className="animate-pulse">▼</span>
              </span>
            </MagneticButton>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 z-5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-accent/10 to-orange-400/10 backdrop-blur-sm animate-float-random"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${8 + i}s`
              }}
            />
          ))}
        </div>

        <div className="absolute bottom-10 animate-bounce-slow z-10">
          <div className="text-3xl text-accent animate-pulse cursor-pointer">
            ↓
          </div>
        </div>
      </section>

      {/* Problem Statement Section with Enhanced Effects */}
      <section ref={problemRef} className="py-20 px-4 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: "url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E')",
              transform: `translateY(${parallaxOffset.slow}px)`
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className={`text-center mb-16 ${isVisible.problem ? 'fade-in-up' : 'invisible'}`}>
            <h2 className="text-3xl md:text-6xl font-bold mb-6 gradient-text">
              The Campus Challenge
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-white">
              Students face significant challenges with high meal costs, housing difficulties, and limited peer-to-peer
              commerce options.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <TiltCard className={`glassmorphism p-8 rounded-xl hover:shadow-2xl hover:shadow-red-500/20 ${isVisible.problem ? 'slide-in-left' : 'invisible'}`}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mr-4">
                  <span className="text-2xl">💸</span>
                </div>
                <h3 className="text-2xl font-bold text-red-400">High Living Costs</h3>
              </div>
              <ul className="space-y-4 text-white">
                {[
                  "Campus meals can cost up to Ksh 250/= per day",
                  "Cooking restrictions in hostels limit affordable options",
                  "Finding affordable housing is time-consuming and challenging"
                ].map((item, index) => (
                  <li key={index} className="flex items-start group">
                    <span className="mr-3 mt-1 text-red-400 group-hover:animate-pulse">•</span>
                    <span className="group-hover:text-gray-200 transition-colors duration-300">{item}</span>
                  </li>
                ))}
              </ul>
            </TiltCard>

            <TiltCard className={`glassmorphism p-8 rounded-xl hover:shadow-2xl hover:shadow-green-500/20 ${isVisible.problem ? 'slide-in-right' : 'invisible'}`}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-2xl font-bold text-green-400">Untapped Opportunities</h3>
              </div>
              <ul className="space-y-4 text-white">
                {[
                  "Off-campus students can prepare meals for just Ksh 100/= per day",
                  "Students have items to sell but lack a dedicated marketplace",
                  "Potential for income generation through peer-to-peer services"
                ].map((item, index) => (
                  <li key={index} className="flex items-start group">
                    <span className="mr-3 mt-1 text-green-400 group-hover:animate-pulse">•</span>
                    <span className="group-hover:text-gray-200 transition-colors duration-300">{item}</span>
                  </li>
                ))}
              </ul>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Features Section with 3D Effects */}
      <section ref={featuresRef} className="py-20 px-4 relative overflow-hidden" style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)"
      }}>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className={`text-center mb-16 ${isVisible.features ? 'fade-in-up' : 'invisible'}`}>
            <h2 className="text-3xl md:text-6xl font-bold mb-6 gradient-text-alt">
              Our Solution
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-white">
              UniConnect offers three integrated services to transform campus life
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🍽️",
                title: "Meal Sharing Network",
                description: "Connect with off-campus students offering affordable, home-cooked meals. Join meal pools or request specific dishes at reduced costs.",
                color: "from-orange-500/20 to-red-500/20",
                hoverColor: "hover:shadow-orange-500/20",
                delay: "200"
              },
              {
                icon: "🏠",
                title: "Rental Listings",
                description: "Find safe, affordable housing with our dedicated rental section. Search and filter properties based on your needs and connect directly with landlords.",
                color: "from-orange-600/20 to-orange-400/20",
                hoverColor: "hover:shadow-orange-500/20",
                delay: "400"
              },
              {
                icon: "🛍️",
                title: "Student Marketplace",
                description: "Buy, sell, or advertise items and services in our in-app marketplace. Foster a circular economy and create income opportunities.",
                color: "from-orange-700/20 to-orange-300/20",
                hoverColor: "hover:shadow-orange-600/20",
                delay: "600"
              }
            ].map((feature, index) => (
              <TiltCard 
                key={index}
                className={`glassmorphism p-8 rounded-xl hover:shadow-2xl ${feature.hoverColor} transition-all duration-500 group feature-card ${isVisible.features ? `fade-in-up delay-${feature.delay}` : 'invisible'}`}
              >
                <div className={`bg-gradient-to-br ${feature.color} p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <span className="text-2xl group-hover:animate-bounce">{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-accent transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-white mb-6 group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>
                <Link to={`/services/${feature.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <MagneticButton className="bg-accent hover:bg-accent-hover backdrop-blur-sm p-3 flex items-center text-white rounded-lg transition-all duration-300 group">
                    Learn more 
                    <span className="ml-2 group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </MagneticButton>
                </Link>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section with Counter Animation */}
      <section ref={benefitsRef} className="py-20 px-4 relative overflow-hidden" style={{
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)"
      }}>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className={`text-center mb-16 ${isVisible.benefits ? 'fade-in-up' : 'invisible'}`}>
            <h2 className="text-3xl md:text-6xl font-bold mb-6 text-white">
              What You'll <span className="gradient-text">Gain</span>
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-white">
              UniConnect transforms campus life in multiple ways
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {[
              {
                number: "01",
                title: "Reduced Living Costs",
                description: "Lower your daily expenses with access to affordable meals and cost-effective peer-to-peer transactions.",
                delay: "100"
              },
              {
                number: "02",
                title: "Income Generation",
                description: "Earn money by selling meals, offering services, or selling goods through the platform.",
                delay: "200"
              },
              {
                number: "03",
                title: "Better Food Quality & Access",
                description: "Enjoy improved quality, variety, and accessibility of food options on campus.",
                delay: "300"
              },
              {
                number: "04",
                title: "Simplified Housing Search",
                description: "Find suitable and affordable off-campus accommodation with ease, connecting with legitimate landlords.",
                delay: "400"
              },
              {
                number: "05",
                title: "Enhanced Community",
                description: "Foster a stronger sense of community and collaboration among students through shared resources.",
                delay: "500"
              },
              {
                number: "06",
                title: "Vibrant Campus Economy",
                description: "Participate in a thriving intra-campus economy through the student marketplace.",
                delay: "600"
              }
            ].map((benefit, index) => (
              <div 
                key={index}
                className={`flex gap-6 group ${isVisible.benefits ? `scale-in delay-${benefit.delay}` : 'invisible'}`}
              >
                <div className="bg-gradient-to-br from-accent/20 to-orange-500/20 p-4 h-16 w-16 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                  <span className="text-accent font-bold text-lg group-hover:text-white transition-colors duration-300">
                    {benefit.number}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-accent transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-white group-hover:text-gray-200 transition-colors duration-300">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview Section with 3D Phone Models */}
      <section ref={previewRef} className="py-20 px-4 relative overflow-hidden" style={{
        background: "linear-gradient(135deg, #111111 0%, #000000 100%)"
      }}>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className={`${isVisible.preview ? 'slide-in-left' : 'invisible'}`}>
              <h2 className="text-3xl md:text-6xl font-bold mb-6 text-white">
                Experience <span className="gradient-text">UniConnect</span>
              </h2>
              <p className="text-lg text-white mb-8">
                Our intuitive mobile app brings all these features together in one seamless experience. Download now and
                transform your campus life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <MagneticButton 
                  className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl transition-all duration-500 transform hover:scale-105 shadow-lg"
                  comingSoon={true}
                >
                  <span className="flex items-center gap-2">
                    📱 Download for iOS
                  </span>
                </MagneticButton>
                <MagneticButton 
                  className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl transition-all duration-500 transform hover:scale-105 shadow-lg"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = 'https://expo.dev/artifacts/eas/8292fc1b-0045-4bf6-a47f-99dc59a41d18.apk';
                    link.download = 'UniConnect.apk';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <span className="flex items-center gap-2">
                    🤖 Download for Android
                  </span>
                </MagneticButton>
              </div>
            </div>

            <div className={`relative h-[600px] flex justify-center ${isVisible.preview ? 'fade-in-up delay-200' : 'invisible'}`}>
              {/* Phone 1 */}
              <div 
                className="absolute phone-float-1"
                style={{
                  left: 'calc(50% - 130px)',
                  transform: `rotate(-8deg)`
                }}
              >
                <div className="relative w-[250px] h-[500px] rounded-[36px] overflow-hidden border-8 border-gray-800 shadow-2xl bg-black phone-3d">
                  <div className="absolute inset-2 rounded-[28px] bg-gradient-to-br from-gray-900 to-black overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-accent/20 to-orange-500/20 flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="w-16 h-16 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                          <span className="text-2xl">🍽️</span>
                        </div>
                        <h4 className="text-white font-bold mb-2">Meal Sharing</h4>
                        <p className="text-gray-300 text-sm">Find affordable meals nearby</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Phone 2 */}
              <div 
                className="absolute phone-float-2"
                style={{
                  left: 'calc(50% - 20px)',
                  top: '10px',
                  transform: `rotate(8deg)`
                }}
              >
                <div className="relative w-[250px] h-[500px] rounded-[36px] overflow-hidden border-8 border-gray-800 shadow-2xl bg-black phone-3d">
                  <div className="absolute inset-2 rounded-[28px] bg-gradient-to-br from-gray-900 to-black overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-orange-300/20 flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <span className="text-2xl">🛍️</span>
                        </div>
                        <h4 className="text-white font-bold mb-2">Marketplace</h4>
                        <p className="text-gray-300 text-sm">Buy & sell with ease</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Animated Background */}
      <section ref={ctaRef} className="py-20 px-4 bg-gradient-to-r from-accent via-orange-500 to-orange-600 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10 animate-float-random"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 40 + 10}px`,
                height: `${Math.random() * 40 + 10}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className={`${isVisible.cta ? 'fade-in-up' : 'invisible'}`}>
            <h2 className="text-3xl md:text-6xl font-bold mb-6 text-white">
              Ready to Transform Your Campus Experience?
            </h2>
            <p className="text-xl text-white mb-8">
              Join thousands of students already benefiting from UniConnect's innovative platform.
            </p>
            <MagneticButton 
              className="bg-white text-accent hover:bg-gray-100 px-12 py-4 text-xl rounded-xl font-bold transition-all duration-500 transform hover:scale-110 shadow-2xl"
              onClick={() => {
                const link = document.createElement('a');
                link.href = 'https://expo.dev/artifacts/eas/8292fc1b-0045-4bf6-a47f-99dc59a41d18.apk';
                link.download = 'UniConnect.apk';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <span className="flex items-center gap-3">
                🚀 Download UniConnect Now
                <span className="animate-bounce">↗</span>
              </span>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <Footer className='m-24'/>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-random {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-30px) translateX(10px) rotate(90deg); }
          50% { transform: translateY(-15px) translateX(-10px) rotate(180deg); }
          75% { transform: translateY(-25px) translateX(5px) rotate(270deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-delayed-2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-delayed-3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        
        .animate-float-random {
          animation: float-random linear infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite;
        }
        
        .animate-float-delayed-2 {
          animation: float-delayed-2 3s ease-in-out infinite 0.5s;
        }
        
        .animate-float-delayed-3 {
          animation: float-delayed-3 3s ease-in-out infinite 1s;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
        }
        
        .slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
        }
        
        .scale-in {
          animation: scale-in 0.6s ease-out forwards;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        
        .glassmorphism {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .gradient-text-alt {
          background: linear-gradient(135deg, #FF9A56 0%, #FFAD75 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .glow-text {
          text-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
        }
        
        .glow-button {
          box-shadow: 0 0 30px rgba(255, 107, 53, 0.3);
        }
        
        .glow-button:hover {
          box-shadow: 0 0 40px rgba(255, 107, 53, 0.5);
        }
        
        .magnetic-button {
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .tilt-card {
          transition: transform 0.3s ease-out;
          transform-style: preserve-3d;
        }
        
        .phone-3d {
          transform-style: preserve-3d;
          transition: transform 0.3s ease-out;
        }
        
        .phone-float-1 {
          animation: float-delayed 4s ease-in-out infinite;
        }
        
        .phone-float-2 {
          animation: float-delayed-2 4s ease-in-out infinite;
        }
        
        .nav-link {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .hero-content > * {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .hero-title {
          animation-delay: 0.2s;
        }
        
        .hero-subtitle {
          animation-delay: 0.4s;
        }
        
        .hero-buttons {
          animation-delay: 0.6s;
        }
        
        .invisible {
          opacity: 0;
        }
        
        .bg-gradient-custom {
          background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
        }
        
        .text-accent { color: #FF6B35; }
        .bg-accent { background-color: #FF6B35; }
        .bg-accent-hover { background-color: #FF8C42; }
        .hover\\:bg-accent-hover:hover { background-color: #FF8C42; }
        .border-accent { border-color: #FF6B35; }
        .hover\\:border-accent:hover { border-color: #FF6B35; }
        .shadow-accent\\/25 { box-shadow: 0 25px 50px -12px rgba(255, 107, 53, 0.25); }
      `}</style>
    </div>
  )
}


// Service pages
import MealSharing from "./pages/MealSharing"
import RentalListings from "./pages/RentalListings"
import StudentMarketplace from "./pages/StudentMarketplace"

// Main App component with routing
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/services/meal-sharing-network" element={<MealSharing />} />
        <Route path="/services/rental-listings" element={<RentalListings />} />
        <Route path="/services/student-marketplace" element={<StudentMarketplace />} />
      </Routes>
    </Router>
  )
}
