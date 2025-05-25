import React from "react";
import "../App.css";
import { Link } from "react-router-dom";

export default function Privacy() {
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
          <div className="flex gap-6">
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
      </nav>

      {/* Header Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Privacy <span className="text-accent">Policy</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white">
              How we collect, use, and protect your information
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Content Section */}
      <section className="py-20 px-4" style={{
        background: "linear-gradient(135deg, #333333 0%, #111111 100%)"
      }}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-darker to-dark p-8 rounded-xl border border-accent/20 fade-in-up">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-accent">1. Introduction</h2>
                <p className="text-white mb-4">
                  At UniConnect, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                </p>
                <p className="text-white">
                  By accessing or using UniConnect, you consent to the data practices described in this policy.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-accent">2. Information We Collect</h2>
                <p className="text-white mb-4">
                  2.1. <span className="font-semibold">Personal Information:</span> When you register for an account, we collect information such as your name, 
                  email address, phone number, and student identification details.
                </p>
                <p className="text-white mb-4">
                  2.2. <span className="font-semibold">User Content:</span> Information you provide when using our services, including meal listings, 
                  rental property details, marketplace listings, and communications with other users.
                </p>
                <p className="text-white">
                  2.3. <span className="font-semibold">Usage Data:</span> Information about how you interact with our platform, including access times, 
                  pages viewed, and features used.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-accent">3. How We Use Your Information</h2>
                <p className="text-white mb-4">
                  3.1. To provide and maintain our services, including processing transactions and facilitating communications between users.
                </p>
                <p className="text-white mb-4">
                  3.2. To improve and personalize your experience on our platform through analysis of usage patterns and preferences.
                </p>
                <p className="text-white mb-4">
                  3.3. To communicate with you about updates, promotions, and important information related to your account or our services.
                </p>
                <p className="text-white">
                  3.4. To ensure the security and integrity of our platform by detecting and preventing fraudulent activity.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-accent">4. Data Sharing and Disclosure</h2>
                <p className="text-white mb-4">
                  4.1. <span className="font-semibold">With Other Users:</span> When you create listings or interact with other users, certain information 
                  will be shared to facilitate these interactions.
                </p>
                <p className="text-white mb-4">
                  4.2. <span className="font-semibold">Service Providers:</span> We may share information with third-party vendors who provide services 
                  on our behalf, such as payment processing and data analysis.
                </p>
                <p className="text-white mb-4">
                  4.3. <span className="font-semibold">Legal Requirements:</span> We may disclose your information if required by law or in response to 
                  valid requests from public authorities.
                </p>
                <p className="text-white">
                  4.4. <span className="font-semibold">Business Transfers:</span> In the event of a merger, acquisition, or sale of assets, your information 
                  may be transferred as part of the transaction.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-accent">5. Data Security</h2>
                <p className="text-white mb-4">
                  5.1. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, 
                  alteration, disclosure, or destruction.
                </p>
                <p className="text-white">
                  5.2. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-accent">6. User Rights</h2>
                <p className="text-white mb-4">
                  6.1. You have the right to access, update, or delete your personal information at any time through your account settings.
                </p>
                <p className="text-white mb-4">
                  6.2. You may opt-out of receiving promotional communications from us by following the unsubscribe instructions included in such communications.
                </p>
                <p className="text-white">
                  6.3. You may request information about how your personal data is processed and request a copy of your personal data.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-accent">7. Cookies and Tracking Technologies</h2>
                <p className="text-white mb-4">
                  7.1. We use cookies and similar tracking technologies to track activity on our platform and hold certain information to improve your experience.
                </p>
                <p className="text-white">
                  7.2. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some features of our platform may not function properly without cookies.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-accent">8. Children's Privacy</h2>
                <p className="text-white">
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-accent">9. Changes to This Privacy Policy</h2>
                <p className="text-white mb-4">
                  9.1. We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                </p>
                <p className="text-white">
                  9.2. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-accent">10. Contact Us</h2>
                <p className="text-white">
                  If you have any questions about this Privacy Policy, please contact us at privacy@uniconnect.com.
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