import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const menuVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: '100%', opacity: 0 },
};

const MobileMenu = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <motion.div
      initial="hidden"
      animate={isOpen ? 'visible' : 'hidden'}
      exit="exit"
      variants={menuVariants}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed top-0 right-0 w-72 sm:w-96 h-full bg-neutral-800 text-white p-8 z-40 flex flex-col gap-5 mt-24"
    >
      <Link to="/" className="hover:text-[#8a6c1a]">Home</Link> 
      <Link to="/aboutclick" className="hover:text-[#8a6c1a]">About</Link> 
      <Link to="/aboutclick" className="hover:text-[#8a6c1a]">Awards</Link>
      <Link to="/brands" className="hover:text-[#8a6c1a]">Our Brands</Link>
      <Link to="/faqs" className="hover:text-[#8a6c1a]">FAQs</Link>
      <Link to="/contact" className="hover:text-[#8a6c1a]">Contact</Link>

      {/* Social Icons */}
      <div className="mt-auto flex gap-4">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500">
          <Facebook size={20} />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500">
          <Instagram size={20} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500">
          <Twitter size={20} />
        </a>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
