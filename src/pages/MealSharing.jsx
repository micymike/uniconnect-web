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

// Main Meal Sharing Component
export default function MealSharing() {
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
                <span className="text-accent">Meal Sharing</span> Network
              </h1>
              <p className="text-xl mb-8 text-white">
                Connect with off-campus students offering affordable, home-cooked meals. Join meal pools or request specific dishes at reduced costs.
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
                      <span className="text-3xl">🍽️</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Affordable Meals</h3>
                    <p className="text-white text-lg">Save up to 60% on your daily food expenses</p>
                    <div className="mt-6 flex justify-center">
                      <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-accent font-bold">Ksh 100</span>
                          <span className="text-white">vs</span>
                          <span className="text-white line-through">Ksh 250</span>
                        </div>
                        <div className="text-sm text-white/70 mt-1">Average meal cost</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 px-4 bg-black/50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              How It <span className="text-accent">Works</span>
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-white">
              Our meal sharing network connects students who can cook with those who need affordable meals
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Find Meal Providers",
                description: "Browse listings from off-campus students who prepare affordable, home-cooked meals.",
                icon: "🔍"
              },
              {
                step: "02",
                title: "Join Meal Pools",
                description: "Participate in meal pools where multiple students share the cost of ingredients and meals.",
                icon: "👥"
              },
              {
                step: "03",
                title: "Request & Enjoy",
                description: "Request specific dishes, arrange pickup or delivery, and enjoy quality meals at reduced costs.",
                icon: "🍲"
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
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Key <span className="text-accent">Features</span>
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-white">
              Our meal sharing network offers a range of features to make finding and sharing meals easy
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Post a Meal",
                description: "Off-campus students can list meals with details: meal type, ingredients, portion size, price, pickup/delivery options.",
                icon: "📝",
                color: "accent"
              },
              {
                title: "Search & Filter",
                description: "Students can search by meal type, location (general area), budget, dietary tags.",
                icon: "🔍",
                color: "orange-400"
              },
              {
                title: "Pooling System",
                description: "Students can create/join meal pools. Meal providers can propose options for pooled funds.",
                icon: "👥",
                color: "orange-500"
              },
              {
                title: "Dietary Preferences",
                description: "Filter meals based on dietary restrictions and preferences like vegetarian, vegan, or allergen-free options.",
                icon: "🥗",
                color: "orange-600"
              },
              {
                title: "Reviews & Ratings",
                description: "Rate and review meal providers based on food quality, timeliness, and overall experience.",
                icon: "⭐",
                color: "orange-300"
              },
              {
                title: "In-App Chat",
                description: "Communicate directly with meal providers to arrange pickup, delivery, or special requests.",
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
      <section className="py-20 px-4 bg-black/50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              <span className="text-accent">Benefits</span> for Students
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-white">
              Our meal sharing network provides numerous advantages for both meal providers and seekers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-black/30 backdrop-blur-sm p-8 rounded-xl border border-accent/10 fade-in-up">
              <h3 className="text-2xl font-bold mb-6 text-accent">For Meal Seekers</h3>
              <ul className="space-y-4">
                {[
                  "Save up to 60% on daily food expenses compared to hotel/restaurant meals",
                  "Access to home-cooked, quality meals even if you live in a hostel",
                  "Variety of meal options from different cuisines and cooking styles",
                  "Flexible options for individual meals or joining meal pools",
                  "Connect with fellow students and build community"
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-accent mr-3">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm p-8 rounded-xl border border-accent/10 fade-in-up delay-200">
              <h3 className="text-2xl font-bold mb-6 text-accent">For Meal Providers</h3>
              <ul className="space-y-4">
                {[
                  "Generate income by preparing extra portions of meals you're already cooking",
                  "Reduce your own meal costs through economies of scale",
                  "Build a reputation and customer base for your cooking skills",
                  "Flexible scheduling - provide meals when it fits your schedule",
                  "Contribute to solving a real problem in the student community"
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
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Frequently Asked <span className="text-accent">Questions</span>
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-white">
              Get answers to common questions about our meal sharing network
            </p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm p-8 rounded-xl border border-accent/10">
            {[
              {
                question: "How do I ensure the quality and safety of meals?",
                answer: "All meal providers undergo a verification process. Additionally, our rating and review system helps maintain quality standards. You can view photos, ingredients, and reviews before ordering."
              },
              {
                question: "How are payments handled?",
                answer: "Currently, payments are coordinated manually between students. In future versions, we plan to implement a secure in-app payment system to facilitate seamless transactions."
              },
              {
                question: "Can I request specific dietary accommodations?",
                answer: "Yes! You can filter meals based on dietary preferences and communicate directly with meal providers to request specific accommodations for allergies or preferences."
              },
              {
                question: "How does the meal pooling system work?",
                answer: "Meal pooling allows multiple students to contribute funds for shared meals. A designated meal provider prepares food for the group, reducing costs through economies of scale. You can create or join existing meal pools."
              },
              {
                question: "What if I need to cancel a meal order?",
                answer: "Cancellation policies are set by individual meal providers. We recommend communicating directly with providers as early as possible if you need to cancel."
              },
              {
                question: "How do I become a meal provider?",
                answer: "Any off-campus student with cooking facilities can become a meal provider. Simply create an account, set up your meal provider profile, and start listing the meals you can offer."
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
              Ready to Transform Your Campus Dining Experience?
            </h2>
            <p className="text-xl text-white mb-8">
              Join thousands of students already benefiting from affordable, quality meals through UniConnect.
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