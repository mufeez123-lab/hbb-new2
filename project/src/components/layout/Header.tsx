import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedHamburger from '../AnimatedHamburger';
import MobileMenu from '../MobileMenu';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Scroll event to toggle header styles
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // ✅ Initialize scroll position on load
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* Top Nav - Desktop only */}
      <div className="bg-black text-white text-sm uppercase py-1 px-4 lg:px-8 hidden lg:block">
        <div className="container mx-auto flex justify-end space-x-6 font-semibold">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/aboutclick" className="hover:text-gray-300">About Us</Link>
          <Link to="/projects" className="hover:text-gray-300">Projects</Link>
          <Link to="/contact" className="hover:text-gray-300">Contact Us</Link>
        </div>
      </div>

      {/* Main Header */}
      <div
        className={`transition-all duration-300 fixed w-full z-50 
          ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-white/60 backdrop-blur-md'} 
          lg:bg-transparent`}
      >
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo-SVG.svg" alt="Logo" className="h-16 w-auto" />
          </Link>

          {/* Right Controls - Desktop only */}
          <div className="hidden lg:flex items-center space-x-4 relative">
            <Link
              to="/contact"
              className="border border-black px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white transition"
            >
              Upcoming Projects
            </Link>
          </div>

          {/* Hamburger - Mobile only */}
          <div className="lg:hidden flex items-center z-50">
            <AnimatedHamburger isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </header>
  );
};

export default Header;
