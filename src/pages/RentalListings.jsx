import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import Footer from "../components/Footer";

// Reuse the FloatingParticles component from App.jsx
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

// Property Card Component
const PropertyCard = ({ type, location, price, amenities, image }) => {
  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 group">
      <div className="h-48 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-orange-500/20 flex items-center justify-center">
          <span className="text-4xl">{image}</span>
        </div>
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-sm py-1 px-3 rounded-full">
          {type}
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors duration-300">{location}</h3>
          <div className="text-accent font-bold">{price}</div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {amenities.map((amenity, index) => (
            <span key={index} className="bg-white/10 text-white text-xs py-1 px-2 rounded-full">
              {amenity}
            </span>
          ))}
        </div>
        <MagneticButton 
          className="w-full bg-accent hover:bg-accent-hover text-white py-2 rounded-lg transition-all duration-300 mt-2"
          comingSoon={true}
        >
          View Details
        </MagneticButton>
      </div>
    </div>
  )
}

// Feature Card Component
const FeatureCard = ({ title, description, icon, color }) => {
  return (
    <div className={`bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-${color}/20 hover:border-${color}/50 transition-all duration-300 hover:shadow-lg hover:shadow-${color}/10`}>
      <div className={`bg-gradient-to-br from-${color}/20 to-${color}/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  )
}

// FAQ Component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="border-b border-gray-800 py-4">
      <button 
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-white">{question}</h3>
        <span className={`text-accent transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      <div className={`mt-2 text-gray-300 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <p className="pb-2">{answer}</p>
      </div>
    </div>
  )
}

// Main Rental Listings Component
export default function RentalListings() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // Calculate scroll progress
      const progress = scrollY / (documentHeight - windowHeight)
      setScrollProgress(progress)
    }
    
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
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
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-4 backdrop-blur-lg bg-black/20 border-b border-white/10 transition-all duration-500">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold group cursor-pointer">
            <span className="group-hover:animate-pulse text-white">Uni</span>
            <span className="text-accent group-hover:text-orange-400 transition-colors duration-300">Connect</span>
          </Link>
          
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
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="fade-in-up">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                <span className="text-accent">Rental</span> Listings
              </h1>
              <p className="text-xl mb-8 text-white">
                Find safe, affordable housing with our dedicated rental section. Search and filter properties based on your needs and connect directly with landlords.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <MagneticButton 
                  className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl transition-all duration-500 transform hover:scale-105 shadow-lg"
                  comingSoon={true}
                >
                  <span className="flex items-center gap-2">
                    📱 Try the App
                  </span>
                </MagneticButton>
                <Link to="/contact">
                  <MagneticButton className="border border-accent/50 backdrop-blur-sm bg-white/5 text-white hover:bg-accent/20 px-6 py-3 rounded-xl transition-all duration-500 hover:border-accent">
                    <span className="flex items-center gap-2">
                      ✉️ Get Updates
                    </span>
                  </MagneticButton>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] fade-in-up delay-200">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-orange-500/20 rounded-2xl overflow-hidden border border-white/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-20 h-20 bg-accent rounded-full mx-auto mb-6 flex items-center justify-center">
                      <span className="text-3xl">🏠</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Student Housing</h3>
                    <p className="text-white text-lg">Find affordable, convenient off-campus housing</p>
                    <div className="mt-6 flex justify-center">
                      <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <div className="text-sm text-white/70">Simplifying your housing search</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Listings Section */}
      <section className="py-20 px-4 bg-black/50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Featured <span className="text-accent">Listings</span>
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-white">
              Preview some of the rental properties available on our platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                type: "Apartment",
                location: "Sunrise Apartments, 2km from Campus",
                price: "Ksh 15,000/mo",
                amenities: ["2 Bedroom", "Furnished", "WiFi", "Water 24/7"],
                image: "🏢"
              },
              {
                type: "Single Room",
                location: "Student Haven, 500m from Campus",
                price: "Ksh 7,000/mo",
                amenities: ["Furnished", "Shared Kitchen", "Security"],
                image: "🏠"
              },
              {
                type: "Bedsitter",
                location: "Campus View, 1km from Campus",
                price: "Ksh 9,000/mo",
                amenities: ["Private Bathroom", "Kitchenette", "WiFi"],
                image: "🏘️"
              },
              {
                type: "Shared Apartment",
                location: "Scholar's Residence, 1.5km from Campus",
                price: "Ksh 8,500/mo",
                amenities: ["Shared 3BR", "Furnished", "Bills Included"],
                image: "🏢"
              },
              {
                type: "Studio",
                location: "Urban Nest, 2km from Campus",
                price: "Ksh 12,000/mo",
                amenities: ["Modern", "All Bills", "Security"],
                image: "🏙️"
              },
              {
                type: "Hostel",
                location: "Academic Heights, On Campus",
                price: "Ksh 6,000/mo",
                amenities: ["Meal Plan Option", "Study Areas", "WiFi"],
                image: "🏫"
              }
            ].map((property, index) => (
              <PropertyCard 
                key={index}
                type={property.type}
                location={property.location}
                price={property.price}
                amenities={property.amenities}
                image={property.image}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              How It <span className="text-accent">Works</span>
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-white">
              Our rental listings platform makes finding student housing simple and efficient
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Search & Filter",
                description: "Browse listings by location, price range, property type, and amenities to find options that match your needs.",
                icon: "🔍"
              },
              {
                step: "02",
                title: "Connect with Landlords",
                description: "Message landlords directly through our secure in-app chat to ask questions and schedule viewings.",
                icon: "💬"
              },
              {
                step: "03",
                title: "Secure Your Housing",
                description: "Once you find the perfect place, arrange to sign the lease and move in on your terms.",
                icon: "🔑"
              }
            ].map((step, index) => (
              <div key={index} className="bg-black/30 backdrop-blur-sm p-8 rounded-xl border border-accent/10 hover:border-accent/30 transition-all duration-300 fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="flex items-center mb-4">
                  <div className="bg-accent/20 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                  <div className="text-4xl font-bold text-accent/50">{step.step}</div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-black/50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Key <span className="text-accent">Features</span>
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-white">
              Our rental listings platform offers a range of features to make finding housing easy
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Verified Listings",
                description: "All rental properties are verified to ensure they meet our standards for student housing.",
                icon: "✓",
                color: "accent"
              },
              {
                title: "Advanced Filters",
                description: "Search by location, price range, property type, number of bedrooms, and amenities.",
                icon: "🔍",
                color: "orange-400"
              },
              {
                title: "Saved Searches",
                description: "Save your search criteria and receive notifications when new matching properties are listed.",
                icon: "🔔",
                color: "orange-500"
              },
              {
                title: "Virtual Tours",
                description: "View property photos and virtual tours to get a feel for the space before scheduling a viewing.",
                icon: "📱",
                color: "orange-600"
              },
              {
                title: "Reviews & Ratings",
                description: "Read reviews from other students about properties and landlords to make informed decisions.",
                icon: "⭐",
                color: "orange-300"
              },
              {
                title: "Secure Messaging",
                description: "Communicate directly with landlords through our secure in-app messaging system.",
                icon: "💬",
                color: "accent"
              }
            ].map((feature, index) => (
              <FeatureCard 
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                color={feature.color}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              <span className="text-accent">Benefits</span> for Everyone
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-white">
              Our rental listings platform provides advantages for both students and landlords
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-black/30 backdrop-blur-sm p-8 rounded-xl border border-accent/10 fade-in-up">
              <h3 className="text-2xl font-bold mb-6 text-accent">For Students</h3>
              <ul className="space-y-4">
                {[
                  "Access to verified, student-friendly rental properties near campus",
                  "Transparent pricing and amenities information",
                  "Direct communication with landlords without middlemen",
                  "Reviews and ratings from other students",
                  "Filters tailored to student housing needs",
                  "Save time by narrowing down options before physical viewings"
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-accent mr-3">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm p-8 rounded-xl border border-accent/10 fade-in-up delay-200">
              <h3 className="text-2xl font-bold mb-6 text-accent">For Landlords</h3>
              <ul className="space-y-4">
                {[
                  "Direct access to student tenants looking for housing",
                  "Showcase your properties with photos and detailed descriptions",
                  "Manage inquiries efficiently through the platform",
                  "Build a reputation through reviews and ratings",
                  "Reduce vacancy periods with targeted exposure",
                  "Optional featured listings for increased visibility"
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-accent mr-3">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 px-4 bg-black/50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Frequently Asked <span className="text-accent">Questions</span>
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-white">
              Get answers to common questions about our rental listings platform
            </p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm p-8 rounded-xl border border-accent/10">
            {[
              {
                question: "How do you verify rental listings?",
                answer: "We verify listings through a combination of landlord verification, property documentation checks, and student reviews. We aim to ensure all listings are legitimate and accurately represented."
              },
              {
                question: "Are there any fees for students using the platform?",
                answer: "No, the platform is completely free for students to search, browse, and contact landlords. We believe in making the housing search process as accessible as possible."
              },
              {
                question: "Can I list a property if I'm not the owner?",
                answer: "We primarily work with property owners or authorized property managers. If you're subletting or have another arrangement, please contact us to discuss your specific situation."
              },
              {
                question: "How far in advance should I start looking for housing?",
                answer: "We recommend starting your search 2-3 months before your intended move-in date. This gives you enough time to explore options, schedule viewings, and make an informed decision."
              },
              {
                question: "What if I have an issue with a landlord or property?",
                answer: "Our platform includes a reporting system for any concerns. We take all reports seriously and will investigate issues to maintain the quality and safety of our listings."
              },
              {
                question: "Can landlords see my personal information?",
                answer: "Landlords can only see the information you choose to share through our messaging system. Your contact details remain private until you decide to share them directly."
              }
            ].map((faq, index) => (
              <FAQItem 
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-accent via-orange-500 to-orange-600 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Ready to Find Your Perfect Student Housing?
            </h2>
            <p className="text-xl text-white mb-8">
              Join thousands of students already using UniConnect to find safe, affordable housing near campus.
            </p>
            <MagneticButton 
              className="bg-white text-accent hover:bg-gray-100 px-12 py-4 text-xl rounded-xl font-bold transition-all duration-500 transform hover:scale-110 shadow-2xl"
              comingSoon={true}
            >
              <span className="flex items-center gap-3">
                🚀 Download UniConnect Now
                <span className="animate-bounce">↗</span>
              </span>
            </MagneticButton>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
