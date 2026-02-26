import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

import Hero from '../components/home/Hero';
import AboutPage from '../pages/AboutPage';
import FeaturedProjects from '../components/home/FeaturedProjects';
import Testimonials from '../components/home/Testimonials';
import Brands from '../components/home/Brands';
import Accordian from '../components/home/Accordian'
import Parallex from '../components/home/Parallex';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Whychooseus from '../components/home/Whychooseus';
import Pillars from '../components/home/Pillars';
import SEO from '../components/seo/Seo';

gsap.registerPlugin(ScrollToPlugin);

const HomePage = () => {
  const scrollToFooter = () => {
    const footer = document.getElementById('footer');
    if (footer) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: footer, offsetY: 0 },
        ease: 'power2.out',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
     <SEO 
        title="Hindustan Limited"
        description="Discover 3BHK and 4BHK commercial and Residential by Hindustan Limited with modern amenities."
        path="/"
        image="https://hindustanbuilders.in/images/villas-preview.jpg"
      />

      <Hero />
      <AboutPage />
      <Pillars/>
      <FeaturedProjects />
      {/* <Whychooseus /> */}
   
      {/* <Testimonials /> */}
      <Parallex />
         <Accordian/>
      {/* <Brands /> */}

      {/* Scroll to Footer Button */}
     
    </motion.div>
  );
};

export default HomePage;
