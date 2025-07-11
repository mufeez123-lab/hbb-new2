import React from 'react';
import { motion } from 'framer-motion';

const Testimonials = () => {
  return (
    <section className="bg-white text-black py-16 px-6 md:px-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        {/* Left Side - Testimonial Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-sm uppercase tracking-widest text-[#8a6c1a] font-semibold mb-2">
            Testimonial
          </h3>
          <h2 className="text-3xl md:text-4xl font-poppins mb-6">
            What Our Customer Say<span className="text-primary-600">?</span>
          </h2>
          <p className="text-lg leading-relaxed mb-4">
            A happy owner speaking about their experience staying at his extravagant property
            <span className="font-bold"> "Hindustan Builders"</span>.
          </p>
          <p className="text-md text-gray-700">
            Choose not just a house, but a lifestyle — your dream home begins with a wise choice.
          </p>
        </motion.div>

        {/* Right Side - YouTube Embed */}
        <motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  whileInView={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6 }}
  className="flex justify-center"
>
  <div className="relative w-full aspect-video max-w-xl rounded-xl overflow-hidden shadow-lg">
    <iframe
      className="w-full h-full border-0"
      src="https://www.youtube.com/embed/V0DbTALQ9oQ?autoplay=1&mute=1&loop=1&playlist=V0DbTALQ9oQ&controls=0&showinfo=0&modestbranding=1&rel=0"
      title="Testimonial Video"
      allow="autoplay; encrypted-media"
      allowFullScreen
    ></iframe>
  </div>
</motion.div>

      </div>
    </section>
  );
};

export default Testimonials;
