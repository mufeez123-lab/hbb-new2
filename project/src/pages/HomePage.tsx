import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

import Hero from '../components/home/Hero';
import AboutPage from '../pages/AboutPage';
import FeaturedProjects from '../components/home/FeaturedProjects';
import Testimonials from '../components/home/Testimonials';
import Brands from '../components/home/Brands';

import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

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
      <Helmet>
        <title>Hindustan Builders </title>
        <meta
          name="description"
          content="Hindustan Builders - Creating landmark properties with exceptional quality and design across India. Explore our residential, commercial and luxury projects."
        />
      </Helmet>

      <Hero />
      <AboutPage />
      <FeaturedProjects />
      <Testimonials />
      <Brands />

      {/* Scroll to Footer Button */}
      <button
        onClick={scrollToFooter}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-black text-white hover:bg-gray-800 shadow-lg"
        aria-label="Scroll to footer"
        title="Scroll to footer"
      >
        ⬇️
      </button>
    </motion.div>
  );
};

export default HomePage;
