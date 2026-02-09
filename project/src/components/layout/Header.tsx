import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AnimatedHamburger from '../AnimatedHamburger';
import MobileMenu from '../MobileMenu';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
   <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
    scrolled 
      ? "bg-black/30 backdrop-blur-md py-2" 
      : "bg-gradient-to-b from-black/60 to-transparent py-4"
  }`}>
      <div className="container mx-auto px-4 lg:px-10">
        <div className="flex items-center justify-between">
          
          {/* LEFT SIDE: Navigation Links (Desktop) */}
           <div className="hidden lg:flex items-center space-x-8 flex-1">
            <Link to="/">
              <img
                src="/newlogo.png"
                alt="Logo"
                className={`w-auto transition-all duration-500 ${
                  scrolled ? "h-14" : "h-16 lg:h-20"
                }`}
              />
            </Link>
          </div>
          {/* CENTER: Logo */}
          <div className="flex justify-center flex-none px-4">
          <a href="/">
           <div className=' text-white tracking-wide  font-light'>
             <h1 className=' uppercase font-display text-3xl font-ptserif tracking-widest font-light' >Hindustan</h1>
            <p className='ml-16 font-display font-light'>LIMITED</p>
           </div>
          </a>
          </div>

          {/* RIGHT SIDE: Navigation & Actions (Desktop) */}
          <nav className="hidden lg:flex items-center justify-end space-x-8 flex-1">
            <Link to="/" className="text-white uppercase tracking-widest text-xs font-semibold hover:opacity-70 transition-opacity">
              Home
            </Link>
            <Link to="/about" className="text-white uppercase tracking-widest text-xs font-semibold hover:opacity-70 transition-opacity">
              About
            </Link>
            <Link to="/projects" className="text-white uppercase tracking-widest text-xs font-semibold hover:opacity-70 transition-opacity">
              Properties
            </Link>
             <Link to="/contact" className="text-white uppercase tracking-widest text-xs font-semibold hover:opacity-70 transition-opacity">
              Contact Us
            </Link>
            
            {/* Search/Icon (Optional - based on image) */}
            <button className="text-white hover:opacity-70">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </nav>

          {/* Hamburger - Mobile only */}
          <div className="lg:hidden flex items-center">
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