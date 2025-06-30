import React from "react";
import { Link } from "react-router-dom";

// SVG icon components
const LinkedInIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden="true">
    <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 20h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76 0-.97.78-1.76 1.75-1.76s1.75.79 1.75 1.76c0 .97-.78 1.76-1.75 1.76zm15.25 11.27h-3v-5.6c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.69h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.85-1.54 3.05 0 3.61 2.01 3.61 4.62v5.56z"/>
  </svg>
);

const InstagramIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden="true">
    <path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.056 1.97.24 2.43.41.59.22 1.01.48 1.45.92.44.44.7.86.92 1.45.17.46.354 1.26.41 2.43.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.41 2.43-.22.59-.48 1.01-.92 1.45-.44.44-.86.7-1.45.92-.46.17-1.26.354-2.43.41-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.43-.41-.59-.22-1.01-.48-1.45-.92-.44-.44-.7-.86-.92-1.45-.17-.46-.354-1.26-.41-2.43C2.212 15.634 2.2 15.25 2.2 12s.012-3.584.07-4.85c.056-1.17.24-1.97.41-2.43.22-.59.48-1.01.92-1.45.44-.44.86-.7 1.45-.92.46-.17 1.26-.354 2.43-.41C8.416 2.212 8.8 2.2 12 2.2zm0-2.2C8.736 0 8.332.013 7.052.072 5.77.13 4.77.32 4.01.6c-.8.3-1.48.7-2.16 1.38C1.17 2.67.77 3.35.47 4.15c-.28.76-.47 1.76-.53 3.04C-.013 8.332 0 8.736 0 12c0 3.264.013 3.668.072 4.948.058 1.28.25 2.28.53 3.04.3.8.7 1.48 1.38 2.16.68.68 1.36 1.08 2.16 1.38.76.28 1.76.47 3.04.53C8.332 23.987 8.736 24 12 24s3.668-.013 4.948-.072c1.28-.058 2.28-.25 3.04-.53.8-.3 1.48-.7 2.16-1.38.68-.68 1.08-1.36 1.38-2.16.28-.76.47-1.76.53-3.04.059-1.28.072-1.684.072-4.948s-.013-3.668-.072-4.948c-.058-1.28-.25-2.28-.53-3.04-.3-.8-.7-1.48-1.38-2.16-.68-.68-1.36-1.08-2.16-1.38-.76-.28-1.76-.47-3.04-.53C15.668.013 15.264 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm7.844-10.406a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/>
  </svg>
);

const TikTokIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" aria-hidden="true">
    <path d="M12.75 2.25v12.5a2.25 2.25 0 1 1-2.25-2.25h.25V9.75h-.25a5.25 5.25 0 1 0 5.25 5.25V7.25a4.75 4.75 0 0 0 4.75 4.75v-2a2.75 2.75 0 0 1-2.75-2.75h-2a2.75 2.75 0 0 1-2.75-2.75z"/>
  </svg>
);

const socialLinks = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/uniconnect-ke/",
    icon: LinkedInIcon,
    color: "hover:text-blue-400"
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/uniconnect_nertwork?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    icon: InstagramIcon,
    color: "hover:text-pink-400"
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@uniconnect16?_t=ZM-8xbeVPJtsKz&_r=1",
    icon: TikTokIcon,
    color: "hover:text-gray-200"
  }
];

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Terms", path: "/terms" },
  { name: "Privacy", path: "/privacy" }
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-black/70 backdrop-blur-lg border-t border-accent/20">
      <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col items-center gap-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 mb-2 group">
          <span className="text-2xl font-bold text-white group-hover:text-accent transition-colors duration-300">
            Uni
          </span>
          <span className="text-2xl font-bold text-accent group-hover:text-orange-400 transition-colors duration-300">
            Connect
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-6 mb-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-300 hover:text-accent transition-colors text-sm font-medium"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Socials */}
        <div className="flex gap-4 mb-2">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-2xl ${social.color} transition-colors duration-300`}
              aria-label={social.name}
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-400 text-center mt-2">
          © {currentYear} UniConnect. All rights reserved. <span className="text-accent">|</span> Made with <span className="text-red-400">♥</span> for students.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
