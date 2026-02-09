import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Home, User, Building2, PhoneCall } from 'lucide-react';

// Main Menu Container Variants
const menuVariants = {
  hidden: { 
    x: '100%', 
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } 
  },
  visible: { 
    x: 0, 
    transition: { 
      duration: 0.6, 
      ease: [0.16, 1, 0.3, 1], // Custom "out-expo" for a smooth snap
      staggerChildren: 0.08,   // Elements will pop in one after another
      delayChildren: 0.2 
    } 
  },
};

// Internal Items Variants (staggered effect)
const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
};

const MobileMenu = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={menuVariants}
          className="fixed top-0 right-0 w-80 sm:w-96 h-full 
                     bg-black/70 backdrop-blur-xl 
                     text-white p-8 z-40 flex flex-col mt-[57px] shadow-2xl border-l border-white/5"
        >
          {/* Navigation Links */}
          <nav className="flex flex-col gap-6 text-lg font-medium">
            {[
              { to: "/", icon: Home, label: "Home" },
              { to: "/about", icon: User, label: "About" },
              { to: "/projects", icon: Building2, label: "Projects" },
              { to: "/contact", icon: PhoneCall, label: "Contact" }
            ].map((link, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Link to={link.to} className="flex items-center gap-4 group hover:text-[#8a6c1a] transition-colors font-display">
                  <link.icon size={20} className="text-white/40 group-hover:text-[#8a6c1a] transition-colors" strokeWidth={1.5} />
                  <span>{link.label}</span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Contact Information */}
          <motion.div variants={itemVariants} className="mt-10 pt-10 border-t border-white/10 space-y-6">
            <h4 className="text-[#8a6c1a] text-xs font-bold font-poppins uppercase tracking-[0.2em]">Contact Details</h4>
            
            <div className="space-y-5">
              <a href="tel:+919961258523" className="flex items-center gap-4 group">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#8a6c1a]/20 transition-colors">
                  <Phone size={18} className="text-[#8a6c1a]" />
                </div>
                <span className="text-sm text-neutral-300 font-poppins group-hover:text-white transition-colors tracking-wide">+91 9961258523</span>
              </a>

              <a href="mailto:info@hindustanbuilders.com" className="flex items-center gap-4 group">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#8a6c1a]/20 transition-colors">
                  <Mail size={18} className="text-[#8a6c1a]" />
                </div>
                <span className="text-sm text-neutral-300 font-poppins group-hover:text-white transition-colors">info@hindustanbuilders.com</span>
              </a>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/5 rounded-lg">
                  <MapPin size={18} className="text-[#8a6c1a]" />
                </div>
                <p className="text-sm text-neutral-400 font-poppins leading-relaxed">
                  Kingdom Tower, NH 66, <br />
                  Thokkottu, Mangaluru, <br />
                  Karnataka - 575017
                </p>
              </div>
            </div>
          </motion.div>

          {/* Social Icons */}
          <motion.div variants={itemVariants} className="mt-auto flex gap-5 pb-10">
            {[Facebook, Instagram, Twitter].map((Icon, idx) => (
              <a key={idx} href="#" className="hover:text-[#8a6c1a] transition-all hover:-translate-y-1">
                <Icon size={22} />
              </a>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;