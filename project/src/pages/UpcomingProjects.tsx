import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';

const UpcomingProjects = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    location: '',
    propertyType: '',
    source: '',
    newsletter: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white py-6 px-4 md:px-10 lg:px-20 mt-20"
    >
      <Helmet>
        <title>Upcoming Projects | Hindustan Bawa Builders</title>
      </Helmet>

      <div className="max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left content */}
        <div>
          <h4 className="text-sm font-semibold uppercase text-[#8a6c1a] mb-1 mt-4 tracking-widest">
            Register & Stay Updated
          </h4>
          <h2 className="text-lg font-semibold mb-4 text-[#8a6c1a] uppercase">
            Upcoming Projects: Residential
          </h2>
          <p className="text-neutral-700 mb-4">
            Hindustan Bawa Builders has earned a strong reputation in Mangalore
            and coastal Karnataka for delivering reliable and well-crafted
            residential spaces. With an emphasis on modern design, transparency,
            and timely delivery, Bawa Builders continues to shape the skyline of
            the city.
          </p>
          <p className="text-neutral-700 mb-4">
            Stay informed about our upcoming residential projects in prime
            locations across Mangalore and surrounding regions. Whether you're
            looking for your dream home or a smart investment opportunity, our
            new launches are designed to meet every need.
          </p>
          <p className="text-neutral-700">
            Sign up now to receive early access and priority notifications about
            our project launches in Mangalore, Udupi, and other coastal cities.
          </p>
        </div>

        {/* Right form */}
        <form
          onSubmit={handleSubmit}
          className="border border-neutral-300 p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4 text-[#8a6c1a] uppercase">
            Request a Callback
          </h3>

          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border-b border-neutral-400 focus:outline-none py-2"
            />

            <input
              type="tel"
              name="mobile"
              placeholder="Your Mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="w-full border-b border-neutral-400 focus:outline-none py-2"
            />

            <input
              type="email"
              name="email"
              placeholder="Enter Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border-b border-neutral-400 focus:outline-none py-2"
            />

            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full border-b border-neutral-400 focus:outline-none py-2 bg-transparent"
            >
              <option value="">Location</option>
              <option value="Mangalore">Mangalore</option>
              <option value="Udupi">Udupi</option>
              <option value="Puttur">Puttur</option>
            </select>

            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              required
              className="w-full border-b border-neutral-400 focus:outline-none py-2 bg-transparent"
            >
              <option value="">Property Type</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Plot">Plot</option>
            </select>

            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              required
              className="w-full border-b border-neutral-400 focus:outline-none py-2 bg-transparent"
            >
              <option value="">Source</option>
              <option value="Website">Website</option>
              <option value="Google">Google</option>
              <option value="Referral">Referral</option>
            </select>

            <label className="flex items-center gap-2 text-sm text-neutral-600">
              <input
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleChange}
              />
              Yes, I want to stay informed and receive newsletter and marketing
              updates.
            </label>

            <button
              type="submit"
              className="w-full bg-[#8a6c1a] text-white py-2 font-semibold hover:bg-black transition"
            >
              Send message
            </button>

            <p className="text-xs text-neutral-500 mt-2">
              By submitting this form you agree to the Terms and Conditions and
              Privacy Policy
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default UpcomingProjects;
