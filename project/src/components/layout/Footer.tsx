import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Package as PackageIcon,
  PhoneCall as PhoneCallIcon,
  ArrowRight,
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <footer className="relative bg-neutral-900 text-white pt-16 pb-8 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img 
          src="/images/3159227.jpg" 
          alt="Building Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/90 to-neutral-800/95"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info with Logo */}
          <div>
            <div className="mb-4">
              <img 
                src="/logo-SVG.svg"
                alt="Hindustan Bawa Logo"
                className="h-12 object-contain"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="100"
                data-aos-once="true"
              />
            </div>
            <p className="text-gray-300 mb-6" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300" data-aos-once="true">
              Building landmarks of excellence and delivering exceptional quality in every project since 1995.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="bg-neutral-800 hover:bg-[#8a6c1a] transition-colors duration-300 h-10 w-10 rounded-full flex items-center justify-center"
                data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400" data-aos-once="true">
                <FacebookIcon size={18} className="text-white" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="bg-neutral-800 hover:bg-[#8a6c1a] transition-colors duration-300 h-10 w-10 rounded-full flex items-center justify-center"
                data-aos="fade-up" data-aos-duration="1000" data-aos-delay="500" data-aos-once="true">
                <InstagramIcon size={18} className="text-white" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="bg-neutral-800 hover:bg-[#8a6c1a] transition-colors duration-300 h-10 w-10 rounded-full flex items-center justify-center"
                data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600" data-aos-once="true">
                <LinkedinIcon size={18} className="text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-poppins mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="inline-flex items-center text-gray-300 hover:text-[#8a6c1a] transition-colors">
                  <HomeIcon size={16} className="mr-2 text-[#8a6c1a]" /> Home
                </Link>
              </li>
              <li>
                <Link to="/aboutclick" className="inline-flex items-center text-gray-300 hover:text-[#8a6c1a] transition-colors">
                  <InfoIcon size={16} className="mr-2 text-[#8a6c1a]" /> About Us
                </Link>
              </li>
              <li>
                <Link to="/projects" className="inline-flex items-center text-gray-300 hover:text-[#8a6c1a] transition-colors">
                  <PackageIcon size={16} className="mr-2 text-[#8a6c1a]" /> Projects
                </Link>
              </li>
              <li>
                <Link to="/contact" className="inline-flex items-center text-gray-300 hover:text-[#8a6c1a] transition-colors">
                  <PhoneCallIcon size={16} className="mr-2 text-[#8a6c1a]" /> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-poppins mb-6 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex"><MapPin size={20} className="text-[#8a6c1a] mr-3 mt-1" /><span className="text-gray-300">Kingdom Tower, NH 66,<br />Thokkottu, Mangaluru 575020, India</span></li>
              <li className="flex items-center"><Phone size={20} className="text-[#8a6c1a] mr-3" /><span className="text-gray-300">+91 9961258523</span></li>
              <li className="flex items-center"><Mail size={20} className="text-[#8a6c1a] mr-3" /><span className="text-gray-300">info@hindustanbawa.com</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-poppins mb-6 text-white">Newsletter</h3>
            <p className="text-gray-300 mb-4">Subscribe to our newsletter for the latest updates.</p>
            <form 
              className="mb-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim() === '') return;
                setSubscribed(true);
                setEmail('');
                setTimeout(() => setSubscribed(false), 3000);
              }}
            >
              <div className="flex">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email" 
                  className="w-full px-4 py-2 text-neutral-700 bg-white rounded-l focus:outline-none focus:ring-2 focus:ring-secondary-500" 
                  required
                />
                <button 
                  type="submit" 
                  className="bg-[#8a6c1a] hover:bg-secondary-600 px-4 py-2 rounded-r transition-colors duration-300"
                >
                  <ArrowRight size={20} className="text-white" />
                </button>
              </div>
            </form>
            {subscribed ? (
              <p className="text-sm text-green-400 mt-2 transition-all duration-300">Thanks for subscribing!</p>
            ) : (
              <p className="text-xs text-gray-400 mt-2">By subscribing, you agree to our Privacy Policy.</p>
            )}
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Hindustan Bawa Builders. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm text-gray-300">
            <Link to="/privacy" className="hover:text-secondary-500 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-secondary-500 transition-colors">Terms of Service</Link>
            <Link to="/sitemap" className="hover:text-secondary-500 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
