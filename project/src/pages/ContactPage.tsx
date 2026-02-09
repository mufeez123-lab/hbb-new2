import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import ContactSection from '../components/home/ContactSection';
import Map from '../components/Map';
import '/src/index.css';
import { Link } from 'react-router-dom';
import Demo from '../components/ScrollReavel.tsx/Demo2';

const ContactPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Contact Us | Hindustan Builders</title>
        <meta name="description" content="Get in touch with Hindustan Builders. Contact us for inquiries about our residential, commercial, and luxury real estate projects." />
      </Helmet>

      

    <Demo/>
      

        <ContactSection />
        <Map/>

    </motion.div>
  );
};

export default ContactPage;