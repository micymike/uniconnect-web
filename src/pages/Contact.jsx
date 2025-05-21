import React from "react";
import "../App.css";

export default function Contact() {
  return (
    <div className="min-h-screen font-roboto bg-gradient-custom text-white">
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
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-white mb-2">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full p-3 bg-darker border border-accent/20 rounded-md text-white"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-white mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full p-3 bg-darker border border-accent/20 rounded-md text-white"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-white mb-2">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    className="w-full p-3 bg-darker border border-accent/20 rounded-md text-white"
                    placeholder="What is this regarding?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-white mb-2">Your Message</label>
                  <textarea 
                    id="message" 
                    rows="5" 
                    className="w-full p-3 bg-darker border border-accent/20 rounded-md text-white"
                    placeholder="Type your message here..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="bg-accent hover:bg-accent-hover button-hover text-white px-8 py-3 text-lg rounded-md"
                >
                  Send Message
                </button>
              </form>
            </div>
            
            <div className="bg-gradient-to-br from-darker to-dark p-8 rounded-xl border border-accent/20 fade-in-up delay-200">
              <h3 className="text-2xl font-bold mb-6 text-white">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-accent/10 p-3 rounded-full flex items-center justify-center">
                    <span className="text-accent">📍</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Address</h4>
                    <p className="text-white">University Campus, Building 4<br />Nairobi, Kenya</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-accent/10 p-3 rounded-full flex items-center justify-center">
                    <span className="text-accent">📧</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Email</h4>
                    <p className="text-white">info@uniconnect.com<br />support@uniconnect.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-accent/10 p-3 rounded-full flex items-center justify-center">
                    <span className="text-accent">📱</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Phone</h4>
                    <p className="text-white">+254 700 123 456<br />+254 733 987 654</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-accent/10 p-3 rounded-full flex items-center justify-center">
                    <span className="text-accent">⏰</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Office Hours</h4>
                    <p className="text-white">Monday - Friday: 9am - 5pm<br />Saturday: 10am - 2pm</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="font-bold text-white mb-4">Follow Us</h4>
                <div className="flex gap-4">
                  <a href="#" className="bg-accent/10 p-3 rounded-full hover:bg-accent/20 transition-colors">
                    <span className="text-accent">📘</span>
                  </a>
                  <a href="#" className="bg-accent/10 p-3 rounded-full hover:bg-accent/20 transition-colors">
                    <span className="text-accent">📸</span>
                  </a>
                  <a href="#" className="bg-accent/10 p-3 rounded-full hover:bg-accent/20 transition-colors">
                    <span className="text-accent">🐦</span>
                  </a>
                  <a href="#" className="bg-accent/10 p-3 rounded-full hover:bg-accent/20 transition-colors">
                    <span className="text-accent">💼</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Find Us</h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-white">
              Visit our office on campus
            </p>
          </div>
          
          <div className="relative h-[400px] rounded-xl overflow-hidden border-8 border-darker shadow-xl fade-in-up">
            {/* This would be replaced with an actual map component */}
            <div className="w-full h-full bg-darker flex items-center justify-center">
              <p className="text-white text-xl">Interactive Map Would Be Here</p>
            </div>
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
              <a href="/" className="text-white hover:text-accent transition-colors">
                Home
              </a>
              <a href="/about" className="text-white hover:text-accent transition-colors">
                About
              </a>
              <a href="/contact" className="text-white hover:text-accent transition-colors">
                Contact
              </a>
              <a href="/terms" className="text-white hover:text-accent transition-colors">
                Terms
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-darker text-center text-white">
            <p>© {new Date().getFullYear()} UniConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}