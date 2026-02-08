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
  MessageCircle,
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <footer id="footer" className="relative bg-neutral-900 text-white pt-16 pb-8 overflow-hidden">
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
                className="h-20 object-contain"
       
              />
            </div>
            <p className="text-gray-300 mb-6 font-poppins text-md leading-tight" >
              Building landmarks of excellence and delivering exceptional quality in every project since 1995.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="bg-neutral-800 hover:bg-[#8a6c1a] transition-colors duration-300 h-10 w-10 rounded-full flex items-center justify-center"
              >
                <FacebookIcon size={18} className="text-white" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="bg-neutral-800 hover:bg-[#8a6c1a] transition-colors duration-300 h-10 w-10 rounded-full flex items-center justify-center"
              >
                <InstagramIcon size={18} className="text-white" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="bg-neutral-800 hover:bg-[#8a6c1a] transition-colors duration-300 h-10 w-10 rounded-full flex items-center justify-center"
            >
                <LinkedinIcon size={18} className="text-white" />
              </a>
              <a href="https://wa.me/919961258523" target="_blank" rel="noopener noreferrer"
                className="bg-neutral-800 hover:bg-[#8a6c1a] transition-colors duration-300 h-10 w-10 rounded-full flex items-center justify-center"
>
    <MessageCircle size={18} className="text-white" />
  </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-poppins mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" onClick={()=> window.scrollTo({top:0, behavior:'smooth'})} className="inline-flex items-center font-display text-gray-300 hover:text-[#8a6c1a] transition-colors">
                  <HomeIcon size={16} className="mr-2 text-[#8a6c1a] " /> Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="inline-flex items-center text-gray-300 hover:text-[#8a6c1a] font-display transition-colors">
                  <InfoIcon size={16} className="mr-2 text-[#8a6c1a]" /> About Us
                </Link>
              </li>
              <li>
                <Link to="/projects" className="inline-flex items-center text-gray-300 hover:text-[#8a6c1a] font-display transition-colors">
                  <PackageIcon size={16} className="mr-2 text-[#8a6c1a]" /> Projects
                </Link>
              </li>
              <li>
                <Link to="/contact" className="inline-flex items-center text-gray-300 hover:text-[#8a6c1a] font-display transition-colors">
                  <PhoneCallIcon size={16} className="mr-2 text-[#8a6c1a]" /> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-poppins mb-6 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center"><Phone size={20} className="text-[#8a6c1a] mr-3" /><span className="text-gray-300 font-display">+91 9961258523</span></li>
              <li className="flex items-center"><Mail size={20} className="text-[#8a6c1a] mr-3" /><span className="text-gray-300 font-display">info@hindustanbuilders.com</span></li>
            </ul>
          </div>

         <div>
            <h3 className="text-xl font-poppins mb-6 text-white">Address</h3>
            <ul className="space-y-4">
                           <li className="flex"><MapPin size={20} className="text-[#8a6c1a] mr-3 mt-1" /><span className="text-gray-300 font-display">Kingdom Tower, NH 66,<br />Thokkottu, Mangaluru 575020, India</span></li>

            </ul>
          </div>
        </div>

      <div className="border-t border-neutral-700 mt-12 pt-6 flex justify-center items-center">
  <p className="text-gray-300 text-sm text-center font-display">
    &copy; {currentYear} Hindustan Builders. All rights reserved.
  </p>
</div>

      </div>
    </footer>
  );
};

export default Footer;
