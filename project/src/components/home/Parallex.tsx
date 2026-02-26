import { motion } from "framer-motion";

const ParallaxContact = () => {
  return (
    <section className="relative h-[50vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-fixed bg-center bg-cover"
        style={{
          backgroundImage: "url('/images/b1.jpg')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full flex items-center justify-between px-6 sm:px-12 md:px-24">
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <div className="w-20 h-1 bg-[#8a6c1a] mb-4" />

            <p className="text-3xl md:text-4xl font-bold font-poppins text-white leading-tight">
              Let’s build spaces that
              <br />
              define lifestyle & legacy.
            </p>

            <p className="mt-4 text-gray-200 text-base font-display md:text-lg font-medium">
              Reach out to Hindustan Builders and take the first step towards your
              dream property.
            </p>
          </motion.div>

          {/* Right Logo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="hidden md:flex items-center justify-center "
          >
            <img
              src="/newlogo.png"
              alt="Hindustan Builders Logo"
              className="w-40 lg:w-[7em] object-contain"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ParallaxContact;
