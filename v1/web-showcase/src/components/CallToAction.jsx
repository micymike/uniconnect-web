const CallToAction = () => {
  return (
    <section className="section bg-gradient-to-r from-primary/20 to-blue-900/20">
      <div className="container mx-auto text-center">
        <h2 className="heading">Ready to Transform Your Campus Experience?</h2>
        <p className="subheading mx-auto">
          Join the ComradesHub community today and discover a new way to connect, share, and thrive on campus.
        </p>
        
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
          <button className="btn-primary text-lg px-10 py-4 rounded-full">
            Download App
          </button>
          <button className="bg-white/10 backdrop-blur-sm text-white font-semibold py-4 px-10 rounded-full hover:bg-white/20 transition-all duration-300 text-lg">
            Learn More
          </button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card">
            <div className="text-4xl font-bold text-primary mb-2">3</div>
            <div className="text-xl font-semibold">Integrated Modules</div>
            <p className="text-gray-400 mt-2">Meals, Rentals, Marketplace</p>
          </div>
          
          <div className="card">
            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-xl font-semibold">Platform Availability</div>
            <p className="text-gray-400 mt-2">Access anytime, anywhere</p>
          </div>
          
          <div className="card">
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-xl font-semibold">Student-Focused</div>
            <p className="text-gray-400 mt-2">Built for campus needs</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;