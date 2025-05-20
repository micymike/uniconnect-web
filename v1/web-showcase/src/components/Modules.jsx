import { useState } from 'react';

const Modules = () => {
  const [activeTab, setActiveTab] = useState('meals');
  
  const modules = {
    meals: {
      title: "Meal Sharing Network",
      description: "A platform where off-campus students can list meals they are preparing, allowing other students to join meal pools, purchase individual meals, or request specific dishes at reduced costs.",
      features: [
        "Post a Meal: List meals with details on ingredients, portion size, price, and pickup options",
        "Search & Filter: Find meals by type, location, budget, and dietary preferences",
        "Pooling System: Create or join meal pools for collaborative consumption",
        "Reviews & Ratings: Ensure quality and build trust in the community"
      ],
      image: "https://images.unsplash.com/photo-1493770348161-369560ae357d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    rentals: {
      title: "Rental Listings & Connection",
      description: "A dedicated section featuring listings of houses, apartments, and rooms for rent, specifically catering to students with easy search and direct landlord connections.",
      features: [
        "Post a Rental: Landlords can list properties with details, photos, and terms",
        "Search & Filter: Find rentals by location, price range, property type, and amenities",
        "Saved Searches & Alerts: Get notified when new matching listings appear",
        "Direct Communication: Secure in-app messaging between students and landlords"
      ],
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80"
    },
    marketplace: {
      title: "Student Marketplace (ComradeDeals)",
      description: "An in-app marketplace where students can buy, sell, or advertise items and services, fostering a circular economy within the student community.",
      features: [
        "Post an Ad: List items or services with descriptions, prices, and photos",
        "Browse & Search: Find items by category, keyword, or price range",
        "Direct Communication: In-app chat for inquiries and transaction coordination",
        "Reviews & Ratings: Build reputation as a reliable buyer or seller"
      ],
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  };
  
  return (
    <section id="modules" className="section bg-gradient-dark">
      <div className="container mx-auto">
        <h2 className="heading text-center">Core Modules</h2>
        <p className="subheading text-center mx-auto">
          ComradesHub offers three integrated services to address different aspects of student life.
        </p>
        
        <div className="flex justify-center mt-12 mb-16">
          <div className="inline-flex bg-black/30 backdrop-blur-sm rounded-full p-1">
            {Object.keys(modules).map((key) => (
              <button
                key={key}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  activeTab === key 
                    ? 'bg-primary text-white' 
                    : 'text-white/70 hover:text-white'
                }`}
                onClick={() => setActiveTab(key)}
              >
                {key === 'meals' ? 'Meal Sharing' : key === 'rentals' ? 'Rental Listings' : 'Marketplace'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 animate-fade-in">
            <h3 className="text-3xl font-bold mb-4 text-primary">{modules[activeTab].title}</h3>
            <p className="text-lg text-gray-300 mb-8">{modules[activeTab].description}</p>
            
            <ul className="space-y-4">
              {modules[activeTab].features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-6 h-6 text-primary mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className="btn-primary mt-8">Learn More</button>
          </div>
          
          <div className="order-1 lg:order-2 animate-fade-in">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 rounded-xl blur-xl"></div>
              <img 
                src={modules[activeTab].image} 
                alt={modules[activeTab].title} 
                className="w-full h-[400px] object-cover rounded-xl relative z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Modules;