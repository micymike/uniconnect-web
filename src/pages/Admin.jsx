import React, { useState, useEffect } from "react";
import "../App.css";
import { Link } from "react-router-dom";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Check if user is already logged in
  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
      fetchFeedbacks();
    }
  }, []);
  
  const handleLogin = (e) => {
    e.preventDefault();
    if (email === import.meta.env.VITE_APP_ADMIN_EMAIL && password === import.meta.env.VITE_APP_ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      localStorage.setItem("adminLoggedIn", "true"); 
      fetchFeedbacks();
    } else {
      setError("Invalid email or password");
    }
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("adminLoggedIn");
  };
  
  const fetchFeedbacks = () => {
    const storedFeedbacks = localStorage.getItem("feedbacks");
    if (storedFeedbacks) {
      setFeedbacks(JSON.parse(storedFeedbacks));
    }
  };
  
  const deleteFeedback = (index) => {
    const updatedFeedbacks = [...feedbacks];
    updatedFeedbacks.splice(index, 1);
    setFeedbacks(updatedFeedbacks);
    localStorage.setItem("feedbacks", JSON.stringify(updatedFeedbacks));
    
    // Update the JSON data for export
    sessionStorage.setItem("latestFeedbackData", JSON.stringify(updatedFeedbacks, null, 2));
  };
  
  const exportToJson = () => {
    try {
      // Get the feedback data
      const jsonData = JSON.stringify(feedbacks, null, 2);
      
      // Create a blob with the JSON data
      const blob = new Blob([jsonData], { type: "application/json" });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a link element
      const link = document.createElement("a");
      link.href = url;
      link.download = `uniconnect-feedback-${new Date().toISOString().split('T')[0]}.json`;
      
      // Append the link to the body
      document.body.appendChild(link);
      
      // Click the link to trigger the download
      link.click();
      
      // Remove the link from the body
      document.body.removeChild(link);
      
      // Release the URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting feedback data:", error);
    }
  };
  
  const importFromJson = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        setFeedbacks(importedData);
        localStorage.setItem("feedbacks", JSON.stringify(importedData));
        sessionStorage.setItem("latestFeedbackData", JSON.stringify(importedData, null, 2));
      } catch (error) {
        console.error("Error importing feedback data:", error);
        alert("Invalid JSON file format");
      }
    };
    reader.readAsText(file);
  };
  
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen font-sans bg-gradient-custom text-white flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-darker to-dark p-8 rounded-xl border border-accent/20 w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Admin Login</h1>
          {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-white mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-darker border border-accent/20 rounded-md text-white"
                placeholder="Enter admin email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-white mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-darker border border-accent/20 rounded-md text-white"
                placeholder="Enter password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-accent hover:bg-accent-hover text-white px-8 py-3 text-lg rounded-md button-hover"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen font-sans bg-gradient-custom text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-4 backdrop-blur-lg bg-black/20 border-b border-white/10 transition-all duration-500">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold group cursor-pointer">
            <span className="group-hover:animate-pulse text-white">Uni</span>
            <span className="text-accent group-hover:text-orange-400 transition-colors duration-300">Connect</span>
            <span className="ml-2 text-sm bg-accent px-2 py-1 rounded-md">Admin</span>
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
            <Link to="/" className="text-white hover:text-accent transition-all duration-300">Home</Link>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-lg mt-2 py-4 px-4 rounded-lg border border-gray-800 animate-fade-in-down">
            <Link 
              to="/"
              className="block py-2 text-white hover:text-accent transition-all duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="block py-2 text-red-400 hover:text-red-300 transition-all duration-300 w-full text-left"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={exportToJson}
              className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-md button-hover flex items-center"
            >
              <span className="mr-2">📥</span> Export JSON
            </button>
            <label className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md button-hover flex items-center cursor-pointer">
              <span className="mr-2">📤</span> Import JSON
              <input 
                type="file" 
                accept=".json" 
                onChange={importFromJson} 
                className="hidden" 
              />
            </label>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md button-hover"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-darker to-dark p-8 rounded-xl border border-accent/20">
          <h2 className="text-2xl font-bold mb-6">Feedback Messages</h2>
          
          {feedbacks.length === 0 ? (
            <p className="text-gray-400">No feedback messages yet.</p>
          ) : (
            <div className="space-y-6">
              {feedbacks.map((feedback, index) => (
                <div key={index} className="bg-black/30 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-accent">{feedback.subject}</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 text-sm">{new Date(feedback.timestamp).toLocaleString()}</span>
                      <button 
                        onClick={() => deleteFeedback(index)}
                        className="text-red-400 hover:text-red-300"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-300 mt-2 whitespace-pre-wrap">{feedback.message}</p>
                  <div className="mt-4 text-sm text-gray-400">
                    <p>From: {feedback.name} ({feedback.email})</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}