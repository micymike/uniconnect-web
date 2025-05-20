import { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/80 backdrop-blur-md py-3' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-white">ComradesHub</h1>
        </div>
        
        <div className="hidden md:flex space-x-8">
          <a href="#features" className="text-white hover:text-primary transition-colors">Features</a>
          <a href="#modules" className="text-white hover:text-primary transition-colors">Modules</a>
          <a href="#about" className="text-white hover:text-primary transition-colors">About</a>
        </div>
        
        <button className="btn-primary">Download App</button>
      </div>
    </nav>
  );
};

export default Navbar;