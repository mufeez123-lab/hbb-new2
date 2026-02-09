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


 const getImageUrl = (image?: BrandImage) => image?.url || '/default-avatar.png';
  const visibleBrands = brands.filter((brand) => brand?.image?.url);

  // Split brands into two groups for two rows
  const row1 = visibleBrands.slice(0, Math.ceil(visibleBrands.length / 2));
  const row2 = visibleBrands.slice(Math.ceil(visibleBrands.length / 2));

  return (
    <section className="py-8 relative overflow-hidden bg-white">
      {/* Section Header */}
      <div className="container mx-auto px-4 mb-2">
        <header className="flex items-center mb-10">
          <div className="flex-grow h-px bg-gray-300"></div>
          <h2 className="px-6 text-lg uppercase tracking-[0.2em] font-medium text-gray-800 text-center">
            OUR HOLDINGS
          </h2>
          <div className="flex-grow h-px bg-gray-300"></div>
        </header>
      </div>

      {/* Scrolling Logos Container */}
      <div className="flex flex-col gap-8">
        
        {/* ROW 1: Moves Left */}
        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex w-max gap-8"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 30,
            }}
          >
            {[...row1, ...row1].map((brand, index) => (
              <LogoItem key={`row1-${index}`} url={getImageUrl(brand.image)} />
            ))}
          </motion.div>
        </div>

        {/* ROW 2: Moves Right */}
        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex w-max gap-8"
            animate={{ x: ["-50%", "0%"] }} // Reverse direction
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 45, // Slightly different speed for a natural look
            }}
          >
            {[...row2, ...row2].map((brand, index) => (
              <LogoItem key={`row2-${index}`} url={getImageUrl(brand.image)} />
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};

// Helper component to keep code clean
const LogoItem = ({ url }: { url: string }) => (
  <div className="flex-shrink-0 w-40 h-36 flex border border-gray-100 items-center justify-center p-4  transition-all duration-300">
    <img
      src={url}
      alt="Brand Logo"
      className="w-32 h-36 object-contain"
    />
  </div>
);

export default Brands;