const TechStack = () => {
  const technologies = [
    {
      name: "React Native Expo",
      description: "For cross-platform iOS and Android mobile app development",
      icon: "https://cdn.worldvectorlogo.com/logos/react-native-1.svg"
    },
    {
      name: "NativeWind CSS",
      description: "Utility-first CSS for React Native styling",
      icon: "https://nativewind.dev/img/logo.svg"
    },
    {
      name: "Appwrite",
      description: "Backend-as-a-Service for authentication, database, storage, and real-time capabilities",
      icon: "https://appwrite.io/images/appwrite.svg"
    },
    {
      name: "NoSQL Database",
      description: "Flexible data structures for evolving application needs",
      icon: "https://cdn-icons-png.flaticon.com/512/4248/4248443.png"
    },
    {
      name: "OAuth Authentication",
      description: "Secure Google login and standard email/password authentication",
      icon: "https://cdn-icons-png.flaticon.com/512/6124/6124998.png"
    },
    {
      name: "Real-Time Communication",
      description: "For chat functionality and live notifications",
      icon: "https://cdn-icons-png.flaticon.com/512/2665/2665038.png"
    }
  ];
  
  return (
    <section className="section bg-black/30">
      <div className="container mx-auto">
        <h2 className="heading text-center">Powered By Modern Tech</h2>
        <p className="subheading text-center mx-auto">
          ComradesHub leverages cutting-edge technologies to deliver a seamless and robust user experience.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {technologies.map((tech, index) => (
            <div 
              key={index} 
              className="card hover:transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <img src={tech.icon} alt={tech.name} className="w-16 h-16 mb-6 object-contain" />
                <h3 className="text-xl font-bold mb-3">{tech.name}</h3>
                <p className="text-gray-400">{tech.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;