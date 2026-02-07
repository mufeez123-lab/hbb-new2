import { motion } from 'framer-motion';

interface BrandImage {
  url: string;
  public_id: string;
}

interface Brand {
  _id: string;
  image: BrandImage;
}

const Brands = () => {
  // 👉 FRONTEND STATIC DATA
 const brands: Brand[] = [
  {
    _id: '1',
    image: { url: '/images/barbe.jpg', public_id: 'b1' },
  },
  {
    _id: '2',
    image: { url: '/images/bawalogo.png', public_id: 'b2' },
  },
  {
    _id: '3',
    image: { url: '/images/bird_2.jpg', public_id: 'b3' },
  },
  {
    _id: '4',
    image: { url: '/images/pngtree.png', public_id: 'b4' },
  },
  {
    _id: '5',
    image: { url: '/images/7299.png', public_id: 'b5' },
  },
  {
    _id: '6',
    image: { url: '/images/8207.jpg', public_id: 'b6' },
  },

  {
    _id: '7',
    image: { url: '/images/1089.jpg', public_id: 'b7' },
  },
  {
    _id: '8',
    image: { url: '/images/bawalogo.png', public_id: 'b8' },
  },
  {
    _id: '9',
    image: { url: '/images/barbe.jpg', public_id: 'b9' },
  },
  {
    _id: '10',
    image: { url: '/images/bird_2.jpg', public_id: 'b10' },
  },
  {
    _id: '11',
    image: { url: '/images/pngtree.png', public_id: 'b11' },
  },
  {
    _id: '12',
    image: { url: '/images/7299.png', public_id: 'b12' },
  },
  {
    _id: '13',
    image: { url: '/images/8207.jpg', public_id: 'b13' },
  },
  {
    _id: '14',
    image: { url: '/images/1089.jpg', public_id: 'b14' },
  },
  {
    _id: '15',
    image: { url: '/images/bawalogo.png', public_id: 'b15' },
  },
  {
    _id: '16',
    image: { url: '/images/8207.jpg', public_id: 'b16' },
  },
];


  const getImageUrl = (image?: BrandImage) =>
    image?.url || '/default-avatar.png';

  const visibleBrands = brands.filter((brand) => brand?.image?.url);

  return (
    <section className="py-8 relative overflow-hidden ">
      {/* Section Header */}
      <div className="container mx-auto px-4 mb-2">
        <motion.h2
          className="text-2xl text-center font-poppins font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          OUR HOLDINGS
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
  <motion.div
    className="flex w-max gap-6 py-4"
    animate={{ x: ["0%", "-50%"] }}
    transition={{
      repeat: Infinity,
      repeatType: "loop",
      duration: 20,
      ease: "linear",
    }}
  >
    {[...visibleBrands, ...visibleBrands].map((brand, index) => (
      <div
        key={index}
        className="flex-shrink-0 w-32 h-32 flex items-center justify-center"
      >
        <img
          src={getImageUrl(brand.image)}
          alt="Brand Logo"
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.src = "/default-avatar.png";
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
