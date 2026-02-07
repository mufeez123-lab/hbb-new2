import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import ContactSection from '../components/home/ContactSection';
import '/src/index.css';

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
<section className="py-10 mt-[54px]">
  <div
    className="relative px-4 w-full h-[300px] flex items-center justify-center bg-center bg-cover"
    style={{
      backgroundImage:
        "linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(160, 160, 160, 0.3)), url('/images/image1.jpg')",
    }}
  >
    <h1 className="text-4xl font-extrabold font- text-center uppercase text-white">
      Contact Us
    </h1>
  </div>
</section>
      <div className="pt-0 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-8 py-5">
          <div className="text-center mb-0">
            
         <div className="container mx-auto px-4 mb-10">
          
        <motion.h2
          className="text-2xl text-center font-poppins font-bold uppercase"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          contact us
        </motion.h2>
        <motion.div
          className="w-20 h-1 bg-[#8a6c1a] mx-auto mb-3"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </div>
          {/* <div className="w-20 h-1 bg-[#8a6c1a] mx-auto mb-6"></div> */}

            <div className="w-20 h-1 bg-dark-500 mx-auto mb-6"></div>
            <p className="text-lg text-neutral-600 font-display max-w-2xl mx-auto">
              Have questions about our projects or want to schedule a visit? 
              We're here to help you find your perfect space.
            </p>
          </div>
        </div>

        <ContactSection />
      </div>
    </motion.div>
  );
};

export default ContactPage;