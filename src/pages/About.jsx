import React from "react";
import "../App.css";
import { Link } from "react-router-dom";

export default function About() {
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
              About <span className="text-accent">UniConnect</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white">
              Transforming campus life through innovation and community
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4" style={{
        background: "linear-gradient(135deg, #333333 0%, #111111 100%)"
      }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="fade-in-up">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-white mb-8">
                UniConnect is envisioned as a comprehensive platform designed to significantly improve the campus experience for students. 
                We aim to address critical student needs by facilitating affordable meal sharing, simplifying the search for suitable rental 
                accommodation, and providing a dynamic marketplace for students to buy, sell, and advertise goods and services.
              </p>
              <p className="text-lg text-white mb-8">
                By fostering a connected and resourceful community, UniConnect seeks to reduce living costs, create economic opportunities, 
                and enhance overall student well-being.
              </p>
            </div>
            <div className="relative h-[400px] flex justify-center fade-in-up delay-200">
              <div className="relative w-full h-full rounded-xl overflow-hidden border-8 border-darker shadow-xl">
                <img
                  src="/images/connect.jpg"
                  alt="UniConnect Mission"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="relative h-[400px] flex justify-center order-2 md:order-1 fade-in-up">
              <div className="relative w-full h-full rounded-xl overflow-hidden border-8 border-darker shadow-xl">
                <img
                  src="/images/connect.jpg"
                  alt="UniConnect Vision"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2 fade-in-up delay-200">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg text-white mb-8">
                We envision a campus ecosystem where students can thrive academically and socially without the burden of excessive living costs. 
                UniConnect aims to be the go-to platform that connects students with resources, opportunities, and each other.
              </p>
              <p className="text-lg text-white mb-8">
                Our goal is to leverage technology to foster collaboration, optimize resource allocation, and build a supportive ecosystem 
                that addresses the economic and practical challenges of student life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4" style={{
        background: "linear-gradient(135deg, #222222 0%, #111111 100%)"
      }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Team</h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-white">
              Meet the passionate individuals behind UniConnect
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-darker to-dark p-8 rounded-xl hover:shadow-lg transition-all duration-300 border border-accent/20 fade-in-up delay-200">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 border-4 border-accent">
                <img
                  src="/images/connect.jpg"
                  alt="Team Member"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white text-center">Michael Moses</h3>
              <p className="text-accent mb-4 text-center">Co-founder</p>
              <p className="text-white text-center">
                Computer Science student with a passion for creating solutions that improve student life.
              </p>
            </div>

            <div className="bg-gradient-to-br from-darker to-dark p-8 rounded-xl hover:shadow-lg transition-all duration-300 border border-accent/20 fade-in-up delay-400">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 border-4 border-accent">
                <img
                  src="/images/connect.jpg"
                  alt="Team Member"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white text-center">James</h3>
              <p className="text-accent mb-4 text-center">Co-founder</p>
              <p className="text-white text-center">
                Full-stack developer with expertise in mobile applications and user experience design.
              </p>
            </div>

            <div className="bg-gradient-to-br from-darker to-dark p-8 rounded-xl hover:shadow-lg transition-all duration-300 border border-accent/20 fade-in-up delay-600">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 border-4 border-accent">
                <img
                  src="/images/connect.jpg"
                  alt="Team Member"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white text-center">Kennedy </h3>
              <p className="text-accent mb-4 text-center">Head of Marketing</p>
              <p className="text-white text-center">
                Business graduate with experience in campus organizations and student welfare initiatives.
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
            <p>© {new Date().getFullYear()} UniConnect. All rights reserved. Made with ❤️ for students.</p>
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
