import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AnimatedHamburger from '../AnimatedHamburger';
import MobileMenu from '../MobileMenu';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Detect scroll (only apply effect on desktop)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20 && window.innerWidth >= 1024) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full ">
      {/* Top Nav - Desktop only */}
      <div className="bg-black text-white text-sm uppercase py-1 px-4 lg:px-8 hidden lg:block">
        <div className="container mx-auto flex justify-end font-poppins space-x-6 font-semibold">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/aboutclick" className="hover:text-gray-300">About Us</Link>
          <Link to="/projects" className="hover:text-gray-300">Projects</Link>
          <Link to="/contact" className="hover:text-gray-300">Contact Us</Link>
        </div>
      </div>

      {/* Main Header */}
      <div className="transition-all duration-300 fixed w-full z-50 bg-transparent backdrop-blur-md border-gray-900 border-b pt-4 sm:pt-0 sm:pb-3">
        <div className="container mx-auto px-4 lg:px-10 flex items-center justify-between py-2">
          {/* Logo */}
          <Link
            to="/"
            className={`flex items-center bg-white border border-gray-100 absolute -top-8 left-4 mt-6 sm:mt-0 sm:ml-[338px] transition-all duration-300
              ${scrolled ? "px-2 py-5" : "px-1 py-3"}`}
          >
            <img
              src="/logo-SVG.svg"
              alt="Logo"
              className={`w-auto transition-all duration-300 ${scrolled ? "h-16" : "h-20 sm:h-24"}`}
            />
          </Link>

          {/* Right Controls - Desktop only */}
          <div className="hidden lg:flex items-end space-x-4 ml-auto">
          <Link
  to="/contact"
  className="
    inline-block
    border border-black 
    px-6 py-2 
    text-sm font-semibold font-poppins
    rounded-none 
    hover:rounded-full 
    hover:bg-black 
    hover:text-white 
    transition-all duration-500 ease-in-out
  "
>
  Upcoming Projects
</Link>
          </div>

          {/* Hamburger - Mobile only */}
          <div className="lg:hidden flex items-center z-50 ml-auto mb-2">
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
