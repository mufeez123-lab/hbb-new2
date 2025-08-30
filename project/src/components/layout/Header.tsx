import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AnimatedHamburger from '../AnimatedHamburger';
import MobileMenu from '../MobileMenu';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

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

      {/* Main Header border-b border-gray-300 */}
     <div className="transition-all duration-300 fixed w-full z-50 bg-transparent backdrop-blur-md  shadow-md pt-4 sm:pt-0 sm:pb-2 sm:pt-0">
  <div className="container mx-auto px-4 lg:px-10 flex items-center justify-between py-2">
    {/* Logo */}
    <Link 
      to="/" 
      className="flex items-center bg-white border-2 border-b border-r border-l px-1 py-2 absolute  -top-8 left-4 mt-6 sm:mt-0 sm:left-16"
    >
      <img src="/logo-SVG.svg" alt="Logo" className="h-20 sm:h-24 w-auto" />
    </Link>

          {/* Right Controls - Desktop only */}
          <div className="hidden lg:flex items-end space-x-4 ml-auto ">
            <Link
              to="/contact"
              className="border border-black px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white transition"
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
