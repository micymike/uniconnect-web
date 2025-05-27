import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

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

// Marketplace Item Card Component
const MarketplaceItemCard = ({ title, price, category, condition, image }) => {
  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 group">
      <div className="h-48 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-orange-500/20 flex items-center justify-center">
          <span className="text-4xl">{image}</span>
        </div>
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-sm py-1 px-3 rounded-full">
          {category}
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors duration-300">{title}</h3>
          <div className="text-accent font-bold">{price}</div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-white/10 text-white text-xs py-1 px-2 rounded-full">
            {condition}
          </span>
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

// Service Card Component
const ServiceCard = ({ title, price, category, provider, image }) => {
  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 group">
      <div className="h-48 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-orange-500/20 flex items-center justify-center">
          <span className="text-4xl">{image}</span>
        </div>
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-sm py-1 px-3 rounded-full">
          {category}
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors duration-300">{title}</h3>
          <div className="text-accent font-bold">{price}</div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-white/10 text-white text-xs py-1 px-2 rounded-full">
            By: {provider}
          </span>
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

// Main Student Marketplace Component
export default function StudentMarketplace() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('items')
  
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
                <span className="text-accent">Student</span> Marketplace
              </h1>
              <p className="text-xl mb-8 text-white">
                Buy, sell, or advertise items and services in our in-app marketplace. Foster a circular economy and create income opportunities.
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
                      <span className="text-3xl">🛍️</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Student Marketplace</h3>
                    <p className="text-white text-lg">Buy, sell, and trade with fellow students</p>
                    <div className="mt-6 flex justify-center">
                      <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <div className="text-sm text-white/70">Creating a circular campus economy</div>
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
            <p className="text-lg max-w-3xl mx-auto text-white mb-8">
              Preview some of the items and services available on our platform
            </p>
            
            {/* Tabs */}
            <div className="flex justify-center gap-4 mb-12">
              <button 
                className={`px-6 py-2 rounded-full transition-all duration-300 ${activeTab === 'items' ? 'bg-accent text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                onClick={() => setActiveTab('items')}
              >
                Items
              </button>
              <button 
                className={`px-6 py-2 rounded-full transition-all duration-300 ${activeTab === 'services' ? 'bg-accent text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                onClick={() => setActiveTab('services')}
              >
                Services
              </button>
            </div>
          </div>
          
          {/* Items Grid */}
          {activeTab === 'items' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Calculus Textbook (8th Edition)",
                  price: "Ksh 1,200",
                  category: "Books",
                  condition: "Like New",
                  image: "📚"
                },
                {
                  title: "HP Laptop (i5, 8GB RAM)",
                  price: "Ksh 35,000",
                  category: "Electronics",
                  condition: "Good",
                  image: "💻"
                },
                {
                  title: "Desk Lamp with USB Port",
                  price: "Ksh 800",
                  category: "Home",
                  condition: "New",
                  image: "💡"
                },
                {
                  title: "Scientific Calculator (FX-991ES)",
                  price: "Ksh 1,500",
                  category: "Electronics",
                  condition: "Good",
                  image: "🧮"
                },
                {
                  title: "Acoustic Guitar",
                  price: "Ksh 5,000",
                  category: "Music",
                  condition: "Used",
                  image: "🎸"
                },
                {
                  title: "Mini Refrigerator",
                  price: "Ksh 7,500",
                  category: "Appliances",
                  condition: "Good",
                  image: "❄️"
                }
              ].map((item, index) => (
                <MarketplaceItemCard 
                  key={index}
                  title={item.title}
                  price={item.price}
                  category={item.category}
                  condition={item.condition}
                  image={item.image}
                />
              ))}
            </div>
          )}
          
          {/* Services Grid */}
          {activeTab === 'services' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Math Tutoring (Calculus)",
                  price: "Ksh 500/hr",
                  category: "Academic",
                  provider: "John M.",
                  image: "🧮"
                },
                {
                  title: "Graphic Design Services",
                  price: "From Ksh 1,000",
                  category: "Creative",
                  provider: "Sarah K.",
                  image: "🎨"
                },
                {
                  title: "Web Development",
                  price: "From Ksh 5,000",
                  category: "Tech",
                  provider: "Michael O.",
                  image: "💻"
                },
                {
                  title: "Essay Proofreading",
                  price: "Ksh 300/page",
                  category: "Academic",
                  provider: "Emily W.",
                  image: "📝"
                },
                {
                  title: "Photography Services",
                  price: "From Ksh 2,000",
                  category: "Creative",
                  provider: "David L.",
                  image: "📸"
                },
                {
                  title: "CV/Resume Writing",
                  price: "Ksh 1,500",
                  category: "Career",
                  provider: "Grace N.",
                  image: "📄"
                }
              ].map((service, index) => (
                <ServiceCard 
                  key={index}
                  title={service.title}
                  price={service.price}
                  category={service.category}
                  provider={service.provider}
                  image={service.image}
                />
              ))}
            </div>
          )}
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
              Our student marketplace makes buying, selling, and offering services simple and efficient
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "List Your Items or Services",
                description: "Create detailed listings with photos, descriptions, and pricing for items you want to sell or services you can offer.",
                icon: "📝"
              },
              {
                step: "02",
                title: "Connect with Buyers/Sellers",
                description: "Use our secure in-app messaging to negotiate, answer questions, and arrange meetups.",
                icon: "💬"
              },
              {
                step: "03",
                title: "Complete Transactions",
                description: "Meet in person to exchange items and payment, or deliver services as agreed upon.",
                icon: "🤝"
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
              Our student marketplace offers a range of features to make buying and selling easy
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Student Verification",
                description: "All users are verified students, creating a trusted community for transactions.",
                icon: "✓",
                color: "accent"
              },
              {
                title: "Category Filtering",
                description: "Easily browse items and services by category, price range, and condition.",
                icon: "🔍",
                color: "orange-400"
              },
              {
                title: "Secure Messaging",
                description: "Communicate directly with buyers or sellers through our secure in-app messaging system.",
                icon: "💬",
                color: "orange-500"
              },
              {
                title: "Ratings & Reviews",
                description: "Build trust through our rating system for both buyers and sellers.",
                icon: "⭐",
                color: "orange-600"
              },
              {
                title: "Saved Searches",
                description: "Save search criteria and receive notifications when matching items are listed.",
                icon: "🔔",
                color: "orange-300"
              },
              {
                title: "Featured Listings",
                description: "Boost your listings for increased visibility (optional paid feature).",
                icon: "🚀",
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
              <span className="text-accent">Benefits</span> for Students
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-white">
              Our student marketplace provides numerous advantages for the campus community
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-black/30 backdrop-blur-sm p-8 rounded-xl border border-accent/10 fade-in-up">
              <h3 className="text-2xl font-bold mb-6 text-accent">For Sellers</h3>
              <ul className="space-y-4">
                {[
                  "Turn unused items into cash quickly and easily",
                  "Reach a targeted audience of fellow students",
                  "Showcase your skills and services to earn income",
                  "Build a reputation through ratings and reviews",
                  "No listing fees for basic listings",
                  "Contribute to campus sustainability through reuse"
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-accent mr-3">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm p-8 rounded-xl border border-accent/10 fade-in-up delay-200">
              <h3 className="text-2xl font-bold mb-6 text-accent">For Buyers</h3>
              <ul className="space-y-4">
                {[
                  "Find affordable textbooks, electronics, and other essentials",
                  "Access student-specific services like tutoring and design work",
                  "Save money compared to retail prices",
                  "Support fellow students rather than large corporations",
                  "Convenient on-campus transactions",
                  "Reduce waste by purchasing used items"
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
              Get answers to common questions about our student marketplace
            </p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm p-8 rounded-xl border border-accent/10">
            {[
              {
                question: "Is there a fee to list items or services?",
                answer: "Basic listings are completely free. We offer optional paid features like 'Featured Listings' to boost visibility, but these are entirely optional."
              },
              {
                question: "How do you ensure safety for in-person transactions?",
                answer: "We recommend meeting in public places on campus for exchanges. We also provide safety tips and a rating system to help build trust within the community."
              },
              {
                question: "What items are not allowed on the marketplace?",
                answer: "Prohibited items include illegal goods, alcohol, tobacco, prescription medications, weapons, and counterfeit items. Full details are available in our Terms of Service."
              },
              {
                question: "How are disputes between buyers and sellers handled?",
                answer: "We offer a reporting system for disputes. While we don't directly mediate transactions, we can suspend accounts that violate our community guidelines."
              },
              {
                question: "Can I offer academic services like essay writing?",
                answer: "Tutoring and academic assistance are allowed, but services that violate academic integrity policies (like writing essays for others) are prohibited."
              },
              {
                question: "How long do listings stay active?",
                answer: "Listings remain active for 30 days by default, after which you can easily renew them if the item hasn't sold or the service is still available."
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
              Ready to Buy, Sell, and Connect?
            </h2>
            <p className="text-xl text-white mb-8">
              Join thousands of students already using UniConnect's marketplace to buy, sell, and offer services.
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
      <footer className="py-10 px-4 bg-black border-t border-gray-800 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Link to="/" className="text-2xl font-bold group cursor-pointer">
                <span className="group-hover:animate-pulse text-white">Uni</span>
                <span className="text-accent group-hover:text-orange-400 transition-colors duration-300">Connect</span>
              </Link>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
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
                  className="relative text-gray-400 hover:text-accent transition-all duration-300 group cursor-pointer"
                >
                  {link.text}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} UniConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}