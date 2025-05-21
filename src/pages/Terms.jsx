import React from "react";
import "../App.css";

export default function Terms() {
  return (
    <div className="min-h-screen font-roboto bg-gradient-custom text-white">
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