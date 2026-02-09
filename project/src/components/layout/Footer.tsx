import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  MessageCircle,ArrowUpRight, History, LayoutGrid, Headset
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-[#fafafa] text-neutral-800 pt-16 pb-8 border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Top Section: Centered Logo & Luxury Dividers */}
        <div className="flex items-center justify-center mb-16">
          <div className="flex-grow h-px bg-gray-200"></div>
          <div className="px-8 flex flex-col items-center">
            {/* <img 
              src="/newlogo.png" 
              alt="Hindustan Bawa Logo" 
              className="h-16 md:h-20 object-contain mb-2" 
            /> */}
     <div className=' text-black tracking-wide  font-light'>
             <h1 className=' uppercase font-display text-3xl font-ptserif tracking-widest font-light' >Hindustan</h1>
            <p className='ml-16 font-display font-light'>LIMITED</p>
           </div>
          </div>
          <div className="flex-grow h-px bg-gray-200"></div>
        </div>

        {/* Middle Section: Minimalist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand Info */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 font-poppins text-gray-900">About Us</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-light font-poppins mb-6">
              Building landmarks of excellence and delivering exceptional quality in every project since 1995.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="text-gray-400 hover:text-[#8a6c1a] transition-colors"><FacebookIcon size={18} /></a>
              <a href="#" className="text-gray-400 hover:text-[#8a6c1a] transition-colors"><InstagramIcon size={18} /></a>
              <a href="#" className="text-gray-400 hover:text-[#8a6c1a] transition-colors"><LinkedinIcon size={18} /></a>
              <a href="#" className="text-gray-400 hover:text-[#8a6c1a] transition-colors"><MessageCircle size={18} /></a>
            </div>
          </div>

          {/* Column 2: Quick Links (Simplified like the image) */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-gray-900 font-poppins">Explore</h3>
            <ul className="space-y-3">
              <li>
             <Link 
        to="/" 
        className="group flex items-center text-sm text-gray-500 hover:text-[#8a6c1a] transition-colors font-poppins font-light"
      >
        <ArrowUpRight size={14} className="mr-2 text-gray-500 group-hover:text-[#8a6c1a] transition-colors" strokeWidth={1.5} />
        Home
      </Link>
    </li>
    <li>
      <Link 
        to="/about" 
        className="group flex items-center text-sm text-gray-500 hover:text-[#8a6c1a] transition-colors font-poppins font-light"
      >
        <History size={14} className="mr-2 text-gray-500 group-hover:text-[#8a6c1a] transition-colors" strokeWidth={1.5} />
        About Our Heritage
      </Link>
    </li>
    <li>
      <Link 
        to="/projects" 
        className="group flex items-center text-sm text-gray-500 hover:text-[#8a6c1a] transition-colors font-poppins font-light"
      >
        <LayoutGrid size={14} className="mr-2 text-gray-500 group-hover:text-[#8a6c1a] transition-colors" strokeWidth={1.5} />
        Featured Projects
      </Link>
    </li>
    <li>
      <Link 
        to="/contact" 
        className="group flex items-center text-sm text-gray-500 hover:text-[#8a6c1a] transition-colors font-poppins font-light"
      >
        <Headset size={14} className="mr-2 text-gray-500 group-hover:text-[#8a6c1a] transition-colors" strokeWidth={1.5} />
        Contact Us
      </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-gray-900 font-poppins">Connect</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-gray-400 mt-0.5" />
                <span className="text-sm text-gray-500 font-light font-poppins">+91 9961258523</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-gray-400 mt-0.5" />
                <span className="text-sm text-gray-500 font-light font-poppins">info@hindustanbuilders.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Address */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-6 text-gray-900 font-poppins">Location</h3>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-gray-400 mt-0.5" />
              <address className="text-sm font-poppins text-gray-500 not-italic leading-relaxed font-light">
                Kingdom Tower, NH 66,<br />
                Thokkottu, Mangaluru 575020,<br />
                Karnataka, India
              </address>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-gray-400 uppercase tracking-widest">
            &copy; {currentYear}. Hindustan Limited. All rights reserved.
          </p>
          <div className="flex gap-6 text-[11px] text-gray-400 uppercase tracking-widest">
            <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-black transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;