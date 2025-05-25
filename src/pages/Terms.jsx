import React from "react";
import "../App.css";
import { Link } from "react-router-dom";

export default function Terms() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
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

      {/* Header Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Terms & <span className="text-accent">Conditions</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white">
              Please read these terms carefully before using UniConnect
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content Section */}
      <section className="py-20 px-4" style={{
        background: "linear-gradient(135deg, #333333 0%, #111111 100%)"
      }}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-darker to-dark p-8 rounded-xl border border-accent/20 fade-in-up">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-accent">1. Introduction</h2>
                <p className="text-white mb-4">
                  Welcome to UniConnect, a comprehensive mobile platform designed to improve the campus experience for students. 
                  By accessing or using our platform, you agree to be bound by these Terms and Conditions.
                </p>
                <p className="text-white">
                  UniConnect provides services including meal sharing, rental listings, and a student marketplace. These Terms 
                  govern your use of our platform and form a binding legal agreement between you and UniConnect.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-accent">2. User Accounts</h2>
                <p className="text-white mb-4">
                  2.1. To access certain features of UniConnect, you must register for an account. You agree to provide accurate, 
                  current, and complete information during the registration process.
                </p>
                <p className="text-white mb-4">
                  2.2. You are responsible for maintaining the confidentiality of your account credentials and for all activities 
                  that occur under your account.
                </p>
                <p className="text-white">
                  2.3. You must be a currently enrolled student or affiliated with a recognized educational institution to use 
                  certain features of the platform.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-accent">3. Meal Sharing Services</h2>
                <p className="text-white mb-4">
                  3.1. UniConnect provides a platform for users to share information about meals they are preparing or seeking. 
                  We do not prepare, provide, or deliver any meals ourselves.
                </p>
                <p className="text-white mb-4">
                  3.2. Users offering meals are responsible for ensuring all food safety standards are met and for accurately 
                  describing the meals offered.
                </p>
                <p className="text-white">
                  3.3. UniConnect is not responsible for the quality, safety, or accuracy of any meal listings on the platform.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-accent">4. Rental Listings</h2>
                <p className="text-white mb-4">
                  4.1. UniConnect provides a platform for landlords to list rental properties and for students to search for 
                  accommodation. We do not own, manage, or control any properties listed.
                </p>
                <p className="text-white mb-4">
                  4.2. Landlords are responsible for ensuring the accuracy of their listings and compliance with all applicable laws.
                </p>
                <p className="text-white">
                  4.3. UniConnect does not guarantee the quality, safety, or availability of any listed properties.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-accent">5. Student Marketplace</h2>
                <p className="text-white mb-4">
                  5.1. UniConnect provides a platform for students to buy, sell, or advertise goods and services. We are not a 
                  party to any transactions between users.
                </p>
                <p className="text-white mb-4">
                  5.2. Users are responsible for ensuring that all items and services offered comply with our guidelines and 
                  applicable laws.
                </p>
                <p className="text-white">
                  5.3. UniConnect does not guarantee the quality, safety, or authenticity of any items or services listed.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-accent">6. User Conduct</h2>
                <p className="text-white mb-4">
                  6.1. You agree not to use UniConnect for any illegal or unauthorized purpose.
                </p>
                <p className="text-white mb-4">
                  6.2. You agree not to post content that is harmful, offensive, or violates the rights of others.
                </p>
                <p className="text-white">
                  6.3. UniConnect reserves the right to remove any content or suspend any user account that violates these terms.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-accent">7. Privacy</h2>
                <p className="text-white mb-4">
                  7.1. Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and 
                  share your information.
                </p>
                <p className="text-white">
                  7.2. By using UniConnect, you consent to the collection and use of your information as described in our Privacy Policy.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-accent">8. Limitation of Liability</h2>
                <p className="text-white mb-4">
                  8.1. UniConnect is provided "as is" without warranties of any kind, either express or implied.
                </p>
                <p className="text-white mb-4">
                  8.2. UniConnect shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
                  resulting from your use of or inability to use the platform.
                </p>
                <p className="text-white">
                  8.3. UniConnect is not responsible for disputes between users or for any loss or damage resulting from user interactions.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-accent">9. Changes to Terms</h2>
                <p className="text-white mb-4">
                  9.1. UniConnect reserves the right to modify these Terms at any time. We will provide notice of significant changes.
                </p>
                <p className="text-white">
                  9.2. Your continued use of UniConnect after changes to the Terms constitutes acceptance of the revised Terms.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-accent">10. Contact Information</h2>
                <p className="text-white">
                  If you have any questions about these Terms, please contact us at legal@uniconnect.com.
                </p>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-accent/20 text-center">
              <p className="text-white">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-black border-t border-gray-800 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <h3 className="text-2xl font-bold group cursor-pointer">
                <span className="group-hover:animate-pulse text-white">Uni</span>
                <span className="text-accent group-hover:text-orange-400 transition-colors duration-300">Connect</span>
              </h3>
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
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-white">
            <p>© {new Date().getFullYear()} UniConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>

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
  );
}
