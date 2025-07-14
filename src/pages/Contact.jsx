import React from "react";
import "../App.css";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function Contact() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Add timestamp to the form data
      const feedbackData = {
        ...formData,
        timestamp: new Date().toISOString()
      };
      
      // Send feedback to backend API
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData)
      });

      if (!response.ok) {
        throw new Error("Failed to send feedback");
      }

      // Show success message
      setSubmitStatus({
        success: true,
        message: "Thank you! Your message has been sent successfully."
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus({
        success: false,
        message: "Oops! Something went wrong. Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Alternative email submission method
  const handleEmailSubmit = () => {
    const subject = encodeURIComponent(`Contact Form: ${formData.subject}`);
    const body = encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}

---
Sent from UniConnect Contact Form
Timestamp: ${new Date().toISOString()}
    `);
    
    window.open(`mailto:uniconnect693@gmail.com?subject=${subject}&body=${body}`);
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-custom text-white overflow-x-hidden">
      
      {/* Scroll Progress Indicator */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-accent to-orange-600 z-50 transition-all duration-300"
        style={{ width: `0%` }}
      />
      
      {/* Mouse Follower */}
      <div 
        className="fixed pointer-events-none z-40 w-6 h-6 rounded-full bg-accent/30 blur-sm transition-all duration-300"
        style={{
          left: `0%`,
          top: `0%`,
          transform: 'translate(-50%, -50%)'
        }}
      />

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
              { text: "Admin", path: "/admin" },
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
              { text: "Admin", path: "/admin" },
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

      {/* Header Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Contact <span className="text-accent">Us</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white">
              We'd love to hear from you. Get in touch with our team.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-4" style={{
        background: "linear-gradient(135deg, #333333 0%, #111111 100%)"
      }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Send Us a Message</h2>
              <p className="text-lg text-white mb-8">
                Have questions about UniConnect? Want to partner with us? Fill out the form and we'll get back to you as soon as possible.
              </p>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-white mb-2">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-darker border border-accent/20 rounded-md text-white placeholder-gray-400"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-white mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-darker border border-accent/20 rounded-md text-white placeholder-gray-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-white mb-2">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-darker border border-accent/20 rounded-md text-white placeholder-gray-400"
                    placeholder="What is this regarding?"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-white mb-2">Message</label>
                  <textarea 
                    id="message" 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    className="w-full p-3 bg-darker border border-accent/20 rounded-md text-white placeholder-gray-400"
                    placeholder="Tell us more about your inquiry..."
                    required
                  />
                </div>
                
                <div className="flex gap-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 bg-accent hover:bg-orange-600 text-white py-3 px-6 rounded-md transition-colors duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                  
                  <button 
                    type="button"
                    onClick={handleEmailSubmit}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-md transition-colors duration-300"
                  >
                    Open Email
                  </button>
                </div>
                
                {submitStatus && (
                  <div className={`p-4 rounded-md ${submitStatus.success ? 'bg-green-600/20 border border-green-600/30' : 'bg-red-600/20 border border-red-600/30'}`}>
                    <p className={submitStatus.success ? 'text-green-400' : 'text-red-400'}>
                      {submitStatus.message}
                    </p>
                  </div>
                )}
              </form>
            </div>
            {/* Contact & Socials Card */}
            <div className="fade-in-up bg-darker rounded-xl border border-accent/20 p-8 flex flex-col gap-4">
              <h3 className="text-2xl font-bold mb-4 text-accent">Contact & Socials</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-blue-600 text-xl">in</span>
                  <a href="https://www.linkedin.com/company/uniconnect-ke/" target="_blank" rel="noopener noreferrer" className="hover:text-accent underline break-all">
                    LinkedIn
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-pink-500 text-xl">📸</span>
                  <a href="https://www.instagram.com/uniconnect_nertwork?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="hover:text-accent underline break-all">
                    Instagram
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-black text-xl">🎵</span>
                  <a href="https://www.tiktok.com/@uniconnect16?_t=ZM-8xbeVPJtsKz&_r=1" target="_blank" rel="noopener noreferrer" className="hover:text-accent underline break-all">
                    TikTok
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-accent text-xl">✉️</span>
                  <a href="mailto:uniconnect693@gmail.com" className="hover:text-accent underline break-all">
                    uniconnect693@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-accent text-xl">✉️</span>
                  <a href="mailto:uniconnectnertwork@gmail.com" className="hover:text-accent underline break-all">
                    uniconnectnertwork@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">📞</span>
                  <a href="tel:0723634236" className="hover:text-accent underline break-all">
                    0723 634 236
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">📞</span>
                  <a href="tel:0758891750" className="hover:text-accent underline break-all">
                    0758 891 750
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <Footer />

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
            transform: translateY(-20px);
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
        
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out forwards;
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
        
        .bg-darker {
          background-color: #1a1a1a;
        }
        
        .bg-dark {
          background-color: #2a2a2a;
        }
        
        .text-accent { color: #FF6B35; }
        .bg-accent { background-color: #FF6B35; }
        .bg-accent-hover { background-color: #FF8C42; }
        .hover\\:bg-accent-hover:hover { background-color: #FF8C42; }
        .border-accent { border-color: #FF6B35; }
        .hover\\:border-accent:hover { border-color: #FF6B35; }
        .shadow-accent\\/25 { box-shadow: 0 25px 50px -12px rgba(255, 107, 53, 0.25); }
        
        .button-hover {
          transition: all 0.3s ease;
        }
        
        .button-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 107, 53, 0.3);
        }
      `}</style>
    </div>
  );
}
