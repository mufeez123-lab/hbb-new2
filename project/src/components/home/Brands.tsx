import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '../../services/api'; // adjust path if needed

interface BrandImage {
  url: string;
  public_id: string;
}

interface Brand {
  _id: string;
  image: BrandImage;
}

const Brands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);

  // Fetch brand data
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await api.get('/brands'); // Make sure this is your public endpoint
        setBrands(res.data || []);
      } catch (error) {
        console.error('Failed to load brands:', error);
      }
    };

    fetchBrands();
  }, []);

  // Ensure safe image access
  const getImageUrl = (image?: BrandImage) =>
    image?.url || '/default-avatar.png';

  const visibleBrands = brands.filter((brand) => brand?.image?.url);

  return (
    <section className="py-12 relative overflow-hidden">
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

      {/* Scrolling Logos */}
      <div className="relative w-full overflow-hidden">
        {/* Scroll Left */}
        <motion.div
          className="flex space-x-4 md:space-x-6 lg:space-x-8 py-4"
          animate={{ x: [0, -1000] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 20,
              ease: 'linear',
            },
          }}
        >
          {[...visibleBrands, ...visibleBrands].map((brand, index) => (
            <div
              key={`left-${index}`}
              className="flex-shrink-0 w-24 h-24 flex items-center justify-center"
            >
              <img
                src={getImageUrl(brand.image)}
                alt="Brand Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/default-avatar.png';
                }}
              />
            </div>
          ))}
        </motion.div>

        {/* Scroll Right */}
        <motion.div
          className="flex space-x-4 md:space-x-6 lg:space-x-8 py-4"
          animate={{ x: [-1000, 0] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 20,
              ease: 'linear',
            },
          }}
        >
          {[...visibleBrands, ...visibleBrands].map((brand, index) => (
            <div
              key={`right-${index}`}
              className="flex-shrink-0 w-24 h-24 flex items-center justify-center"
            >
              <img
                src={getImageUrl(brand.image)}
                alt="Brand Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/default-avatar.png';
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Brands;
