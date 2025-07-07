import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

// Components
import Hero from '../components/home/Hero';
import AboutPage from '../pages/AboutPage';
import FeaturedProjects from '../components/home/FeaturedProjects';
import Testimonials from '../components/home/Testimonials';
import Brands from '../components/home/Brands';
// import ContactSection from '../components/home/ContactSection';

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Hindustan Builders </title>
        <meta name="description" content="Hindustan Builders - Creating landmark properties with exceptional quality and design across India. Explore our residential, commercial and luxury projects." />
      </Helmet>

      <Hero />
      <AboutPage />
      <FeaturedProjects />
      <Testimonials />
      <Brands />
      {/* <ContactSection /> */}
    </motion.div>
  );
};

export default HomePage;