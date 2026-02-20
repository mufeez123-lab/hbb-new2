import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Send, Phone, Mail, MapPin } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GOOGLE_FORM_ACTION_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScEyNly6ROJE-bJHXwQWvYelPdJFz31Z3fkVojF9HKBwTypfw/formResponse';

const ContactSection = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    interest: '', // Changed to empty string for the text input
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0, pointerEvents: 'auto' });
    } else {
      controls.start({ opacity: 0, y: 30, pointerEvents: 'none' });
    }
  }, [isInView, controls]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Using URLSearchParams helps prevent 400 errors with Google Forms
    // by ensuring the content-type is 'application/x-www-form-urlencoded'
    const queryString = new URLSearchParams();
    queryString.append('entry.281785921', formData.name);
    queryString.append('entry.398950261', formData.email);
    queryString.append('entry.1646278928', formData.phone);
    queryString.append('entry.1120006159', formData.interest || 'General'); // Fallback to General
    queryString.append('entry.1901800010', formData.message);

    try {
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: queryString.toString(),
      });

      setIsSubmitted(true);
      toast.success('Thank you! Your message has been sent successfully.');

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          interest: '',
        });
      }, 3000);
    } catch (error) {
      console.error('Submission failed', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section ref={ref} className="py-20 bg-white">
        <motion.div
          animate={controls}
          initial={{ opacity: 0, y: 30, pointerEvents: 'none' }}
          transition={{ duration: 0.1 }}
          className="container mx-auto px-4 md:px-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* LEFT SECTION */}
            <div className='bg-[#fbfff7] p-6 rounded-lg shadow-lg'>
              <h2 className="text-2xl md:text-4xl font-poppins text-[#8a6c1a] mb-4">
                Get in Touch 
              </h2>
              <p className="text-neutral-600 mb-8 font-display">
                Whether you're interested in our projects or have questions, we’re here to help.
              </p>

              <div className="space-y-6 mb-10">
                <div className="flex items-start">
                  <div className="bg-[#8a6c1a] text-white rounded-full p-2 mr-4">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold font-poppins text-[#8a6c1a] mb-1">Call Us</h3>
                    <p className="text-neutral-600 font-display">+91-9961258523</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#8a6c1a] text-white rounded-full p-2 mr-4">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#8a6c1a] mb-1 font-poppins">Email Us</h3>
                    <p className="text-neutral-600 font-display">info@hindustanbuilders.in</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#8a6c1a] text-white rounded-full p-2 mr-4">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#8a6c1a] mb-1 font-poppins">Visit Us</h3>
                    <p className="text-neutral-600 font-display">
                      Kingdom Tower, NH 66, <br />
                      Thokkottu, Mangaluru 575020
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION (FORM) */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-2xl mb-6 font-poppins text-neutral-800">Submit Your Query</h1>

                {isSubmitted ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-6 text-center">
                    <h4 className="font-semibold mb-2">Thank You!</h4>
                    <p>Your message has been sent successfully.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-poppins">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className="w-full mb-4 px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#8a6c1a] outline-none"
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Your email"
                        className="w-full mb-4 px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#8a6c1a] outline-none"
                      />
                    </div>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Your phone number"
                      className="w-full mb-4 px-4 py-3 border border-neutral-200 placeholder:font-poppins rounded-lg focus:ring-2 focus:ring-[#8a6c1a] outline-none"
                    />

                    {/* UPDATED: General Enquiry Input Box */}
                    <input
                      type="text"
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      placeholder="Enquiry Type (e.g., Residential, Commercial, Investment)"
                      className="w-full mb-4 px-4 py-3 border border-neutral-200 placeholder:font-poppins rounded-lg focus:ring-2 focus:ring-[#8a6c1a] outline-none"
                    />

                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Your message"
                      className="w-full mb-6 px-4 py-3 border placeholder:font-poppins border-neutral-200 rounded-lg focus:ring-2 focus:ring-[#8a6c1a] outline-none resize-none"
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#8a6c1a] text-white py-3 rounded-lg flex justify-center items-center hover:bg-[#745e16] transition-colors font-poppins font-semibold"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                      <Send size={18} className="ml-2" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <ToastContainer position="top-right" autoClose={5000} />
      </section>
    </>
  );
};

export default ContactSection;
