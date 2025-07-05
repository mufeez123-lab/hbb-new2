import { motion } from 'framer-motion';

const brands = [
  { id: 1, logo: '/images/bawalogo.png' },
  { id: 2, logo: '/images/7299.png' },
  { id: 3, logo: '/images/8207.jpg' },
  { id: 4, logo: '/images/preview.jpg' },
  { id: 5, logo: '/images/1089.jpg' },
  { id: 6, logo: '/images/barbe.jpg' },
  { id: 7, logo: '/images/bird_2.jpg' },
  { id: 8, logo: '/images/pngtree.png' }
];

const Brands = () => {
  return (
    <section className="py-12 relative overflow-hidden mt-20 ">
      {/* Section Header */}
      <div className="container mx-auto px-4 mb-10">
        <motion.h2 
          className="text-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our Brands
        </motion.h2>
        <motion.div 
          className="w-20 h-1 bg-[#8a6c1a] mx-auto mb-3"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </div>

      {/* Scrolling Logos Container */}
      <div className="relative w-full overflow-hidden">
        {/* First Row - Scroll Left */}
        <motion.div
          className="flex space-x-4 md:space-x-6 lg:space-x-8 py-4"
          animate={{ x: [0, -1000] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {[...brands, ...brands].map((brand, index) => (
            <div
              key={`left-${index}`}
              className="flex-shrink-0 w-24 h-24 flex items-center justify-center"
            >
              <img
                src={brand.logo}
                alt="Brand Logo"
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </motion.div>

        {/* Second Row - Scroll Right */}
        <motion.div
          className="flex space-x-4 md:space-x-6 lg:space-x-8 py-4"
          animate={{ x: [-1000, 0] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {[...brands, ...brands].map((brand, index) => (
            <div
              key={`right-${index}`}
              className="flex-shrink-0 w-24 h-24 flex items-center justify-center"
            >
              <img
                src={brand.logo}
                alt="Brand Logo"
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Brands;
