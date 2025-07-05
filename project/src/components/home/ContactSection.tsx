import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Send, Phone, Mail, MapPin } from 'lucide-react';
import emailjs from '@emailjs/browser';

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

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0, pointerEvents: 'auto' });
    } else {
      controls.start({ opacity: 0, y: 30, pointerEvents: 'none' });
    }
  }, [isInView, controls]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    emailjs
      .send(
        'service_r4lw7nn',         // ✅ your EmailJS service ID
        'template_35v4jap',         // ✅ your EmailJS template ID
        formData,
        'wUdeNSJ0V6jqmnIBC'     // ✅ your EmailJS public key
      )
      .then(() => {
        setIsSubmitted(true);
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
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        alert('Failed to send message');
      });
  };

  return (
    <section ref={ref} className="py-20 bg-neutral-100 ">
      <motion.div
        animate={controls}
        initial={{ opacity: 0, y: 30, pointerEvents: 'none' }}
        transition={{ duration: 0.1 }}
        className="container mx-auto px-4 md:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Column - Contact Info */}
          <div>
            <h2 className="text-2xl md:text-4xl font-poppins  text-[#8a6c1a] mb-4">
              Get in Touch
            </h2>
            <p className="text-neutral-600 mb-8">
              Whether you're interested in our projects or have questions about our services, our team
              is here to help you. Reach out to us through the form or contact us directly.
            </p>

            {/* Contact Details */}
            <div className="space-y-6 mb-10">
              <div className="flex items-start">
                <div className="bg-[#8a6c1a] text-white rounded-full p-2 mr-4">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#8a6c1a] mb-1">Call Us</h3>
                  <p className="text-neutral-600">+91-9961258523</p>
                  
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#8a6c1a] text-white rounded-full p-2 mr-4">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#8a6c1a] mb-1">Email Us</h3>
                  <p className="text-neutral-600">info@hindustanbawa.com</p>
                  {/* <p className="text-neutral-600">sales@hindustanbawa.com</p> */}
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#8a6c1a] text-white rounded-full p-2 mr-4">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#8a6c1a] mb-1">Visit Us</h3>
                  <p className="text-neutral-600">
                    Kingdom Tower, NH 66,
                    <br />
                    Thokkottu, Mangaluru 575020, India
                  </p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white p-6 rounded-lg shadow-soft">
              <h3 className="text-lg font-semibold text-[#8a6c1a] mb-3">Business Hours</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-neutral-600">Monday - Friday:</span>
                  <span className="text-[#8a6c1a] font-medium">9:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-neutral-600">Saturday:</span>
                  <span className="text-[#8a6c1a] font-medium">10:00 AM - 4:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-neutral-600">Sunday:</span>
                  <span className="text-[#8a6c1a] font-medium">Closed</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-2xl mb-4 font-poppins">Contact Us</h1>

              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 text-center">
                  <h4 className="font-semibold mb-2">Thank You!</h4>
                  <p>Your message has been sent successfully. We'll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-neutral-700 font-medium mb-2">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="email" className="block text-neutral-700 font-medium mb-2">
                        Email Address*
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                        placeholder="Your email"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-neutral-700 font-medium mb-2">
                        Phone Number*
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                        placeholder="Your phone"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="interest" className="block text-neutral-700 font-medium mb-2">
                      I'm interested in
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="residential">Residential Properties</option>
                      <option value="commercial">Commercial Properties</option>
                      <option value="luxury">Luxury Villas</option>
                      <option value="investment">Investment Opportunities</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-neutral-700 font-medium mb-2">
                      Message*
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#8a6c1a] text-white py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
                  >
                    Send Message
                    <Send size={18} className="ml-2" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactSection;
