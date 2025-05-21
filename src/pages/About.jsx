import React from "react";
import "../App.css";

export default function About() {
  return (
    <div className="min-h-screen font-roboto bg-gradient-custom text-white">
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
              <h3 className="text-2xl font-bold mb-2 text-white text-center">John Doe</h3>
              <p className="text-accent mb-4 text-center">Founder & CEO</p>
              <p className="text-white text-center">
                Computer Science graduate with a passion for creating solutions that improve student life.
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
              <h3 className="text-2xl font-bold mb-2 text-white text-center">Jane Smith</h3>
              <p className="text-accent mb-4 text-center">CTO</p>
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
              <h3 className="text-2xl font-bold mb-2 text-white text-center">Michael Johnson</h3>
              <p className="text-accent mb-4 text-center">Head of Operations</p>
              <p className="text-white text-center">
                Business graduate with experience in campus organizations and student welfare initiatives.
              </p>
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