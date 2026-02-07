import { motion } from "framer-motion";

const ParallaxContact = () => {
  return (
    <section className="relative h-[60vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-fixed bg-center bg-cover"
        style={{
          backgroundImage: "url('/images/image1.jpg')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-xl ml-6 sm:ml-12 md:ml-24 px-4"
        >
          <div className="w-20 h-1 bg-[#8a6c1a] mb-4" />

          <p className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Let’s build spaces that<br />
            define lifestyle & legacy.
          </p>

          <p className="mt-4 text-gray-200 text-base md:text-lg font-medium">
            Reach out to Hindustan Builders and take the first step towards your dream property.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ParallaxContact;
