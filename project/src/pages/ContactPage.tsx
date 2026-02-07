import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import ContactSection from '../components/home/ContactSection';
import '/src/index.css';
import { Link } from 'react-router-dom';

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
 <section className="py-0 mt-[90px]">
    <div
  className="relative px-4 w-full h-[300px] flex flex-col items-center justify-center bg-center bg-cover"
  style={{
    backgroundImage:
      "linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(160, 160, 160, 0.3)), url('/images/image3.jpg')",
  }}
>
  <h1 className="text-4xl font-extrabold text-center uppercase text-white">
    Contact Us
  </h1>

  {/* Breadcrumb */}
  <div className="mt-2 text-sm text-white/80">
    <Link to="/" className="hover:text-white transition">
      Home
    </Link>
    <span className="mx-2">/</span>
    <span className="text-white font-medium">Contact Us</span>
  </div>
</div>

        
      </section>
    
      

        <ContactSection />

    </motion.div>
  );
};

export default ContactPage;