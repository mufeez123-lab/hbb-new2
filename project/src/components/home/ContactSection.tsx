import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Send, Phone, Mail, MapPin } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Google Form Action URL
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
    interest: 'general',
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare data for Google Forms
    const googleFormData = new FormData();
    googleFormData.append('entry.281785921', formData.name);
    googleFormData.append('entry.398950261', formData.email);
    googleFormData.append('entry.1646278928', formData.phone);
    googleFormData.append('entry.1120006159', formData.interest);
    googleFormData.append('entry.1901800010', formData.message);

    try {
      // Submit to Google Forms silently (no-cors)
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: googleFormData,
      });

      // Show success message
      setIsSubmitted(true);
      toast.success('Thank you! Your message has been sent successfully.');

      // Reset form after delay
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          interest: 'general',
        });
      }, 3000);

    } catch (error) {
      console.error('Submission failed', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section ref={ref} className="py-20 bg-neutral-100">
        <motion.div
          animate={controls}
          initial={{ opacity: 0, y: 30, pointerEvents: 'none' }}
          transition={{ duration: 0.1 }}
          className="container mx-auto px-4 md:px-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* LEFT */}
            <div>
              <h2 className="text-2xl md:text-4xl font-poppins text-[#8a6c1a] mb-4">
                Get in Touch
              </h2>
              <p className="text-neutral-600 mb-8">
                Whether you're interested in our projects or have questions,
                we’re here to help.
              </p>

              <div className="space-y-6 mb-10">
                <div className="flex items-start">
                  <div className="bg-[#8a6c1a] text-white rounded-full p-2 mr-4">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#8a6c1a] mb-1">
                      Call Us
                    </h3>
                    <p className="text-neutral-600">+91-9961258523</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#8a6c1a] text-white rounded-full p-2 mr-4">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#8a6c1a] mb-1">
                      Email Us
                    </h3>
                    <p className="text-neutral-600">
                      info@hindustanbawa.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#8a6c1a] text-white rounded-full p-2 mr-4">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#8a6c1a] mb-1">
                      Visit Us
                    </h3>
                    <p className="text-neutral-600">
                      Kingdom Tower, NH 66,
                      <br />
                      Thokkottu, Mangaluru 575020
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-2xl mb-2 font-poppins">Contact Us</h1>

                {isSubmitted ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 text-center">
                    <h4 className="font-semibold mb-2">Thank You!</h4>
                    <p>Your message has been sent successfully.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full mb-4 px-4 py-3 border rounded-lg"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Your email"
                      className="w-full mb-4 px-4 py-3 border rounded-lg"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Your phone"
                      className="w-full mb-4 px-4 py-3 border rounded-lg"
                    />

                    <select
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className="w-full mb-4 px-4 py-3 border rounded-lg"
                    >
                      <option value="general">General Enquiry</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="investment">Investment</option>
                    </select>

                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Your message"
                      className="w-full mb-6 px-4 py-3 border rounded-lg"
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#8a6c1a] text-white py-3 rounded-lg flex justify-center items-center hover:bg-[#745e16] transition-colors"
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