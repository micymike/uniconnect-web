import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

// Advanced Floating Particles with Physics
const AdvancedParticles = () => {
  const [particles, setParticles] = useState([])
  
  useEffect(() => {
    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      hue: Math.random() * 60 + 15 // Orange spectrum
    }))
    setParticles(newParticles)
  }, [])
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-float-physics"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `hsl(${particle.hue}, 100%, 60%)`,
            opacity: particle.opacity,
            animation: `float-physics ${15 + Math.random() * 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            filter: 'blur(1px)',
            boxShadow: `0 0 ${particle.size * 2}px hsl(${particle.hue}, 100%, 60%)`
          }}
        />
      ))}
    </div>
  )
}

// 3D Magnetic Button with Advanced Effects
const UltraMagneticButton = ({ children, className, onClick, ...props }) => {
  const buttonRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  
  const handleMouseMove = (e) => {
    if (!buttonRef.current) return
    const button = buttonRef.current
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    const intensity = isHovered ? 0.15 : 0.05
    button.style.transform = `
      perspective(1000px) 
      rotateY(${x * intensity}deg) 
      rotateX(${-y * intensity}deg) 
      translateZ(${isHovered ? 20 : 0}px) 
      scale(${isHovered ? 1.05 : 1})
    `
  }
  
  const handleMouseLeave = () => {
    if (buttonRef.current) {
      buttonRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)'
    }
    setIsHovered(false)
  }
  
  return (
    <button
      ref={buttonRef}
      className={`ultra-magnetic-button ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-accent to-orange-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
    </button>
  )
}

// Interactive 3D Card with Flip Effect
const Interactive3DCard = ({ frontContent, backContent, className }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const cardRef = useRef(null)
  
  const handleMouseMove = (e) => {
    if (!cardRef.current || isFlipped) return
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 15
    const rotateY = (centerX - x) / 15
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  }
  
  const handleMouseLeave = () => {
    if (cardRef.current && !isFlipped) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    }
  }
  
  return (
    <div 
      className={`interactive-3d-card ${className} ${isFlipped ? 'flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        ref={cardRef}
        className="card-inner"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="card-front">
          {frontContent}
        </div>
        <div className="card-back">
          {backContent}
        </div>
      </div>
    </div>
  )
}

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0)
  const counterRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
          let start = 0
          const increment = end / (duration / 16)
          const timer = setInterval(() => {
            start += increment
            if (start >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 16)
        }
      },
      { threshold: 0.5 }
    )
    
    if (counterRef.current) {
      observer.observe(counterRef.current)
    }
    
    return () => observer.disconnect()
  }, [end, duration, isVisible])
  
  return (
    <span ref={counterRef} className="animated-counter">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

// Morphing Shape Component
const MorphingShape = ({ className }) => {
  return (
    <div className={`morphing-shape ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="morphGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B35" />
            <stop offset="50%" stopColor="#FF8C42" />
            <stop offset="100%" stopColor="#FF9A56" />
          </linearGradient>
        </defs>
        <path
          fill="url(#morphGradient)"
          className="morph-path"
          d="M100,20 C120,20 150,50 180,100 C150,150 120,180 100,180 C80,180 50,150 20,100 C50,50 80,20 100,20 Z"
        />
      </svg>
    </div>
  )
}

// Interactive Timeline Component
const InteractiveTimeline = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  
  const timelineEvents = [
    {
      year: "2024",
      title: "The Vision",
      description: "UniConnect was conceived as a solution to address the growing challenges students face with meal costs and campus resource allocation.",
      icon: "💡"
    },
    {
      year: "2024",
      title: "Development Begins",
      description: "Our team of passionate developers started building the platform with a focus on user experience and community building.",
      icon: "🚀"
    },
    {
      year: "2024",
      title: "Beta Testing",
      description: "Launched closed beta testing with select university students to gather feedback and refine the platform.",
      icon: "🧪"
    },
    {
      year: "2025",
      title: "Official Launch",
      description: "UniConnect officially launches, connecting thousands of students across multiple campuses.",
      icon: "🎉"
    }
  ]
  
  return (
    <div className="interactive-timeline">
      <div className="timeline-line" />
      {timelineEvents.map((event, index) => (
        <div
          key={index}
          className={`timeline-item ${index === activeIndex ? 'active' : ''}`}
          onClick={() => setActiveIndex(index)}
        >
          <div className="timeline-marker">
            <span className="timeline-icon">{event.icon}</span>
          </div>
          <div className="timeline-content">
            <div className="timeline-year">{event.year}</div>
            <h3 className="timeline-title">{event.title}</h3>
            <p className="timeline-description">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// Main About Component
export default function About() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState({
    hero: false,
    mission: false,
    vision: false,
    stats: false,
    timeline: false,
    team: false
  })
  
  const heroRef = useRef(null)
  const missionRef = useRef(null)
  const visionRef = useRef(null)
  const statsRef = useRef(null)
  const timelineRef = useRef(null)
  const teamRef = useRef(null)
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target
            if (target === heroRef.current) setIsVisible(prev => ({ ...prev, hero: true }))
            if (target === missionRef.current) setIsVisible(prev => ({ ...prev, mission: true }))
            if (target === visionRef.current) setIsVisible(prev => ({ ...prev, vision: true }))
            if (target === statsRef.current) setIsVisible(prev => ({ ...prev, stats: true }))
            if (target === timelineRef.current) setIsVisible(prev => ({ ...prev, timeline: true }))
            if (target === teamRef.current) setIsVisible(prev => ({ ...prev, team: true }))
          }
        })
      },
      { threshold: 0.2 }
    )
    
    const refs = [heroRef, missionRef, visionRef, statsRef, timelineRef, teamRef]
    refs.forEach(ref => {
      if (ref.current) observer.observe(ref.current)
    })
    
    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(scrolled / maxScroll)
    }
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      refs.forEach(ref => {
        if (ref.current) observer.unobserve(ref.current)
      })
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
  
  return (
    <div className="min-h-screen font-sans bg-ultra-dark text-white overflow-x-hidden">
      <AdvancedParticles />
      
      {/* Ultra Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50">
        <div 
          className="h-full bg-gradient-to-r from-accent via-orange-500 to-orange-600 transition-all duration-300"
          style={{ 
            width: `${scrollProgress * 100}%`,
            boxShadow: `0 0 20px rgba(255, 107, 53, 0.6)`
          }}
        />
      </div>
      
      {/* Advanced Mouse Follower */}
      <div 
        className="fixed pointer-events-none z-40 transition-all duration-500"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="w-8 h-8 rounded-full bg-accent/20 blur-md animate-pulse" />
        <div className="absolute inset-2 w-4 h-4 rounded-full bg-accent/40 blur-sm" />
        <div className="absolute inset-3 w-2 h-2 rounded-full bg-accent animate-ping" />
      </div>

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
            ].map((link, index) => (
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


      {/* Revolutionary Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <MorphingShape className="absolute top-20 right-20 w-32 h-32 opacity-30" />
        <MorphingShape className="absolute bottom-20 left-20 w-24 h-24 opacity-20" />
        
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className={`${isVisible.hero ? 'hero-reveal' : 'opacity-0'}`}>
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
              <span className="inline-block transform hover:rotate-3 transition-transform duration-300">About</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-orange-500 to-orange-600 animate-gradient-x">
                UniConnect
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-gray-300 leading-relaxed">
              We're not just building an app—we're crafting the future of campus life through 
              <span className="text-accent font-semibold"> revolutionary technology</span> and 
              <span className="text-orange-400 font-semibold"> human connection</span>.
            </p>
            <UltraMagneticButton className="group bg-gradient-to-r from-accent to-orange-500 hover:from-orange-600 hover:to-accent text-white px-12 py-4 text-lg rounded-2xl font-bold transition-all duration-500 shadow-2xl hover:shadow-accent/25">
              <span className="flex items-center gap-3">
                🚀 Discover Our Journey
                <span className="transform group-hover:translate-x-2 transition-transform duration-300">→</span>
              </span>
            </UltraMagneticButton>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-complex"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${8 + i * 2}s`
              }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/10 to-orange-500/10 backdrop-blur-sm border border-accent/20" />
            </div>
          ))}
        </div>
      </section>

      {/* Revolutionary Stats Section */}
      <section ref={statsRef} className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-black/50" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className={`text-center mb-20 ${isVisible.stats ? 'slide-up' : 'opacity-0'}`}>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Impact in <span className="text-accent">Numbers</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: 10000, suffix: "+", label: "Students Served", icon: "👥" },
              { number: 5000, suffix: "+", label: "Meals Shared", icon: "🍽️" },
              { number: 2000, suffix: "+", label: "Housing Matches", icon: "🏠" },
              { number: 98, suffix: "%", label: "Satisfaction Rate", icon: "⭐" }
            ].map((stat, index) => (
              <div
                key={index}
                className={`stat-card group ${isVisible.stats ? 'scale-in' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-6xl mb-4 group-hover:animate-bounce">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-black text-accent mb-2">
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                </div>
                <div className="text-lg text-gray-300 group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Mission Section */}
      <section ref={missionRef} className="py-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`${isVisible.mission ? 'slide-in-left' : 'opacity-0'}`}>
              <h2 className="text-5xl md:text-6xl font-bold mb-8">
                Our <span className="text-accent">Mission</span>
              </h2>
              <div className="space-y-6 text-lg leading-relaxed">
                <p className="text-white">
                  UniConnect is more than a platform—it's a <span className="text-accent font-semibold">movement</span> designed to fundamentally transform the campus experience for students worldwide.
                </p>
                <p className="text-gray-300">
                  We're building a comprehensive ecosystem that addresses critical student needs through innovative technology, fostering affordable meal sharing, simplifying housing searches, and creating dynamic marketplaces.
                </p>
                <p className="text-gray-300">
                  Our vision extends beyond mere convenience—we're cultivating connected, resourceful communities that reduce living costs, create economic opportunities, and enhance overall student well-being.
                </p>
              </div>
            </div>
            
            <div className={`relative ${isVisible.mission ? 'slide-in-right' : 'opacity-0'}`}>
              <div className="mission-visual">
                <div className="floating-card">
                  <div className="card-content">
                    <span className="text-4xl mb-4 block">🎯</span>
                    <h3 className="text-xl font-bold text-white mb-2">Student-Centric</h3>
                    <p className="text-gray-300 text-sm">Every decision focuses on student needs</p>
                  </div>
                </div>
                <div className="floating-card" style={{ animationDelay: '0.5s' }}>
                  <div className="card-content">
                    <span className="text-4xl mb-4 block">🌐</span>
                    <h3 className="text-xl font-bold text-white mb-2">Connected</h3>
                    <p className="text-gray-300 text-sm">Building bridges between students</p>
                  </div>
                </div>
                <div className="floating-card" style={{ animationDelay: '1s' }}>
                  <div className="card-content">
                    <span className="text-4xl mb-4 block">💡</span>
                    <h3 className="text-xl font-bold text-white mb-2">Innovative</h3>
                    <p className="text-gray-300 text-sm">Cutting-edge solutions for modern challenges</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Timeline Section */}
      <section ref={timelineRef} className="py-32 px-4 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-20 ${isVisible.timeline ? 'fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Our <span className="text-accent">Journey</span>
            </h2>
            <p className="text-xl text-gray-300">Click on any milestone to explore our story</p>
          </div>
          
          <div className={`${isVisible.timeline ? 'timeline-reveal' : 'opacity-0'}`}>
            <InteractiveTimeline />
          </div>
        </div>
      </section>

      {/* Revolutionary Team Section */}
      <section ref={teamRef} className="py-32 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-20 ${isVisible.team ? 'fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Meet the <span className="text-accent">Visionaries</span>
            </h2>
            <p className="text-xl text-gray-300">The brilliant minds shaping the future of campus life</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                name: "Michael Moses",
                role: "Co-founder & CEO",
                bio: "Computer Science visionary with a passion for creating solutions that improve student life through technology.",
                skills: ["Leadership", "Product Strategy", "Full-Stack Development"],
                social: { linkedin: "#", twitter: "#", github: "#" }
              },
              {
                name: "James",
                role: "Co-founder & CTO",
                bio: "Full-stack developer with expertise in mobile applications and revolutionary user experience design.",
                skills: ["Mobile Dev", "UI/UX", "System Architecture"],
                social: { linkedin: "#", twitter: "#", github: "#" }
              },
              {
                name: "Kennedy",
                role: "Head of Marketing",
                bio: "Business graduate with extensive experience in campus organizations and student welfare initiatives.",
                skills: ["Marketing", "Community", "Business Strategy"],
                social: { linkedin: "#", twitter: "#", github: "#" }
              },
              {
                name: "Sumare",
                role: "Head of Marketting",
                bio: "Business graduate with extensive experience in campus organizations and student welfare initiatives.",
                skills: ["Marketing", "Community", "Business Strategy"],
                social: { linkedin: "#", twitter: "#", github: "#" }
              },
              {
                name: "Wafula Sheila",
                role: "Software Engineer",
                bio: "Business graduate with extensive experience in campus organizations and student welfare initiatives.",
                skills: ["Marketing", "Community", "Business Strategy"],
                social: { linkedin: "#", twitter: "#", github: "#" }
              }
            ].map((member, index) => (
              <Interactive3DCard
                key={index}
                className={`${isVisible.team ? 'team-card-reveal' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 300}ms` }}
                frontContent={
                  <div className="team-card-front">
                    <div className="avatar-container">
                      <div className="avatar-ring" />
                      <div className="avatar-image">
                        <span className="text-4xl">{member.name.charAt(0)}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                    <p className="text-accent mb-4 font-semibold">{member.role}</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{member.bio}</p>
                    <div className="mt-6 text-xs text-gray-400">Click to flip</div>
                  </div>
                }
                backContent={
                  <div className="team-card-back">
                    <h3 className="text-2xl font-bold text-white mb-6">Skills & Expertise</h3>
                    <div className="skills-list">
                      {member.skills.map((skill, i) => (
                        <div key={i} className="skill-tag">
                          {skill}
                        </div>
                      ))}
                    </div>
                    <div className="social-links">
                      <div className="social-link">💼 LinkedIn</div>
                      <div className="social-link">🐦 Twitter</div>
                      <div className="social-link">💻 GitHub</div>
                    </div>
                    <div className="mt-6 text-xs text-gray-400">Click to flip back</div>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Revolutionary Footer */}
      <footer className="py-16 px-4 bg-black border-t border-accent/20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="footer-glow" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-8 md:mb-0">
              <h3 className="text-3xl font-bold group cursor-pointer">
                <span className="text-white group-hover:text-orange-300 transition-colors duration-300">Uni</span>
                <span className="text-accent group-hover:animate-pulse">Connect</span>
              </h3>
            </div>
            <div className="flex gap-8">
              {[
                { text: "Home", path: "/" },
                { text: "About", path: "/about" },
                { text: "Contact", path: "/contact" },
                { text: "Terms", path: "/terms" }
              ].map((link) => (
                <div 
                  key={link.text}
                  className="relative group cursor-pointer"
                >
                  <span className="text-gray-400 hover:text-accent transition-all duration-300 transform hover:scale-110 inline-block">
                    {link.text}
                  </span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p className="text-lg">© {new Date().getFullYear()} UniConnect. Revolutionizing campus life with ❤️</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* Advanced Keyframes */
        @keyframes float-physics {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
            filter: hue-rotate(0deg);
          }
          25% { 
            transform: translateY(-30px) translateX(15px) rotate(90deg) scale(1.1);
            filter: hue-rotate(90deg);
          }
          50% { 
            transform: translateY(-15px) translateX(-20px) rotate(180deg) scale(0.9);
            filter: hue-rotate(180deg);
          }
          75% { 
            transform: translateY(-40px) translateX(10px) rotate(270deg) scale(1.05);
            filter: hue-rotate(270deg);
          }
        }
        
        @keyframes float-complex {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1);
            opacity: 0.7;
          }
          33% { 
            transform: translateY(-20px) rotate(120deg) scale(1.1);
            opacity: 1;
          }
          66% { 
            transform: translateY(-10px) rotate(240deg) scale(0.9);
            opacity: 0.8;
          }
        }
        
        @keyframes morph {
          0%, 100% {
            d: path("M100,20 C120,20 150,50 180,100 C150,150 120,180 100,180 C80,180 50,150 20,100 C50,50 80,20 100,20 Z");
          }
          25% {
            d: path("M100,30 C130,30 160,60 170,100 C160,140 130,170 100,170 C70,170 40,140 30,100 C40,60 70,30 100,30 Z");
          }
          50% {
            d: path("M100,25 C125,35 155,65 175,100 C155,135 125,165 100,175 C75,165 45,135 25,100 C45,65 75,35 100,25 Z");
          }
          75% {
            d: path("M100,35 C115,25 145,55 185,100 C145,145 115,175 100,165 C85,175 55,145 15,100 C55,55 85,25 100,35 Z");
          }
        }
        
        @keyframes hero-reveal {
          0% {
            opacity: 0;
            transform: translateY(100px) scale(0.8);
            filter: blur(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0px) scale(1);
            filter: blur(0px);
          }
        }
        
        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(80px);
          }
          100% {
            opacity: 1;
            transform: translateY(0px);
          }
        }
        
        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.5) rotateY(180deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotateY(0deg);
          }
        }
        
        @keyframes slide-in-left {
          0% {
            opacity: 0;
            transform: translateX(-150px) rotateY(-30deg);
          }
          100% {
            opacity: 1;
            transform: translateX(0px) rotateY(0deg);
          }
        }
        
        @keyframes slide-in-right {
          0% {
            opacity: 0;
            transform: translateX(150px) rotateY(30deg);
          }
          100% {
            opacity: 1;
            transform: translateX(0px) rotateY(0deg);
          }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(60px);
          }
          100% {
            opacity: 1;
            transform: translateY(0px);
          }
        }
        
        @keyframes timeline-reveal {
          0% {
            opacity: 0;
            transform: scaleX(0);
          }
          100% {
            opacity: 1;
            transform: scaleX(1);
          }
        }
        
        @keyframes team-card-reveal {
          0% {
            opacity: 0;
            transform: translateY(100px) rotateX(45deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0px) rotateX(0deg);
          }
        }
        
        @keyframes card-flip {
          0% { transform: perspective(1000px) rotateY(0deg); }
          100% { transform: perspective(1000px) rotateY(180deg); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        /* Component Styles */
        .ultra-magnetic-button {
          position: relative;
          transform-style: preserve-3d;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          overflow: hidden;
        }
        
        .ultra-magnetic-button:hover {
          box-shadow: 
            0 20px 40px rgba(255, 107, 53, 0.3),
            0 0 30px rgba(255, 107, 53, 0.2),
            inset 0 0 30px rgba(255, 255, 255, 0.1);
        }
        
        .interactive-3d-card {
          perspective: 1000px;
          height: 400px;
          cursor: pointer;
        }
        
        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-style: preserve-3d;
        }
        
        .interactive-3d-card.flipped .card-inner {
          transform: rotateY(180deg);
        }
        
        .card-front, .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 20px;
          padding: 30px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 107, 53, 0.3);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        
        .card-back {
          transform: rotateY(180deg);
          background: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 140, 66, 0.05) 100%);
        }
        
        .morphing-shape {
          animation: float-complex 8s ease-in-out infinite;
        }
        
        .morph-path {
          animation: morph 10s ease-in-out infinite;
        }
        
        .animated-counter {
          display: inline-block;
          font-variant-numeric: tabular-nums;
        }
        
        .stat-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 107, 53, 0.2);
          border-radius: 20px;
          padding: 40px 20px;
          text-align: center;
          transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-style: preserve-3d;
        }
        
        .stat-card:hover {
          transform: translateY(-20px) rotateX(10deg);
          border-color: rgba(255, 107, 53, 0.5);
          box-shadow: 
            0 30px 60px rgba(0, 0, 0, 0.3),
            0 0 40px rgba(255, 107, 53, 0.2);
        }
        
        .mission-visual {
          position: relative;
          height: 400px;
        }
        
        .floating-card {
          position: absolute;
          width: 200px;
          padding: 20px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 107, 53, 0.3);
          border-radius: 15px;
          animation: float-complex 6s ease-in-out infinite;
        }
        
        .floating-card:nth-child(1) {
          top: 0;
          left: 0;
        }
        
        .floating-card:nth-child(2) {
          top: 50%;
          right: 0;
          transform: translateY(-50%);
        }
        
        .floating-card:nth-child(3) {
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .interactive-timeline {
          position: relative;
          padding: 40px 0;
        }
        
        .timeline-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(to bottom, transparent, #FF6B35, #FF8C42, transparent);
          transform: translateX(-50%);
        }
        
        .timeline-item {
          position: relative;
          margin: 60px 0;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .timeline-item:nth-child(odd) .timeline-content {
          margin-right: 60%;
          text-align: right;
        }
        
        .timeline-item:nth-child(even) .timeline-content {
          margin-left: 60%;
          text-align: left;
        }
        
        .timeline-marker {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #FF6B35, #FF8C42);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: all 0.3s ease;
          border: 4px solid #000;
        }
        
        .timeline-item.active .timeline-marker,
        .timeline-item:hover .timeline-marker {
          transform: translate(-50%, -50%) scale(1.3);
          box-shadow: 0 0 30px rgba(255, 107, 53, 0.6);
        }
        
        .timeline-icon {
          font-size: 24px;
        }
        
        .timeline-content {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 107, 53, 0.3);
          border-radius: 15px;
          padding: 30px;
          transition: all 0.3s ease;
        }
        
        .timeline-item.active .timeline-content,
        .timeline-item:hover .timeline-content {
          border-color: rgba(255, 107, 53, 0.6);
          transform: scale(1.05);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        
        .timeline-year {
          font-size: 24px;
          font-weight: bold;
          color: #FF6B35;
          margin-bottom: 10px;
        }
        
        .timeline-title {
          font-size: 24px;
          font-weight: bold;
          color: white;
          margin-bottom: 15px;
        }
        
        .timeline-description {
          color: #ccc;
          line-height: 1.6;
        }
        
        .team-card-front, .team-card-back {
          height: 100%;
        }
        
        .avatar-container {
          position: relative;
          margin-bottom: 20px;
        }
        
        .avatar-ring {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: linear-gradient(45deg, #FF6B35, #FF8C42, #FF9A56);
          animation: spin 8s linear infinite;
        }
        
        .avatar-image {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF6B35, #FF8C42);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: bold;
          color: white;
        }
        
        .skills-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 30px;
        }
        
        .skill-tag {
          background: linear-gradient(45deg, #FF6B35, #FF8C42);
          padding: 10px 20px;
          border-radius: 25px;
          color: white;
          font-weight: bold;
          text-align: center;
          transform: scale(0.95);
          transition: all 0.3s ease;
        }
        
        .skill-tag:hover {
          transform: scale(1);
        }
        
        .social-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .social-link {
          color: #FF6B35;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .social-link:hover {
          color: white;
          transform: translateX(10px);
        }
        
        .footer-glow {
          position: absolute;
          top: 0;
          left: 50%;
          width: 300px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #FF6B35, transparent);
          transform: translateX(-50%);
          filter: blur(1px);
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Animation Classes */
        .hero-reveal {
          animation: hero-reveal 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .slide-up {
          animation: slide-up 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .scale-in {
          animation: scale-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .slide-in-left {
          animation: slide-in-left 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .slide-in-right {
          animation: slide-in-right 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .timeline-reveal {
          animation: timeline-reveal 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .team-card-reveal {
          animation: team-card-reveal 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .animate-gradient-x {
          background-size: 400% 400%;
          animation: gradient-x 3s ease infinite;
        }
        
        /* Utility Classes */
        .bg-ultra-dark {
          background: radial-gradient(ellipse at top, #1a1a1a 0%, #000000 100%);
        }
        
        .text-accent { color: #FF6B35; }
        .bg-accent { background-color: #FF6B35; }
        .border-accent { border-color: #FF6B35; }
      `}</style>
    </div>
  )
}