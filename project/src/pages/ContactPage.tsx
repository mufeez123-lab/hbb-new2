import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import ContactSection from '../components/home/ContactSection';
import Map from '../components/Map';
import '/src/index.css';
import { Link } from 'react-router-dom';
import Demo from '../components/ScrollReavel.tsx/Demo2';
import SEO from '../components/seo/Seo';

const ContactPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SEO 
        title="Contact Us | Hindustan Limited"
        description="At Hindustan Limited, Construction is a discipline of precision. Drawing on over four decades of experience, we execute complex architectural details with exactitude. We don’t just build for the handover; we build for the next generation."
        path="/contact"
        image="https://hindustanbuilders.in/images/villas-preview.jpg"
      />

      

    <Demo/>
      

        <ContactSection />
        <Map/>

    </motion.div>
  );
};

export default ContactPage;