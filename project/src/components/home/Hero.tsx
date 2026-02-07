import { useState } from 'react';
import Slider from 'react-slick';
import '/src/index.css';

interface HeroImage {
  url: string;
  public_id: string;
  title: string;      // Added title field
  subtitle: string;   // Added subtitle field
}

const Hero = () => {
  const [images] = useState<HeroImage[]>([
    {
      url: '/images/image3.jpg',
      public_id: 'hero-1',
      title: 'Hindustan Heights',
      subtitle: 'Modern living Experience'
    },
    {
      url: '/images/img1.jpg',
      public_id: 'hero-2',
      title: 'Luxury Villas',
      subtitle: 'Experience elegance '
    },
    {
      url: '/images/image1.jpg',
      public_id: 'hero-3',
      title: 'Premium Spaces',
      subtitle: 'Crafting excellence '
    },
  ]);

  const PrevArrow = (props: any) => (
    <button
      onClick={props.onClick}
      className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white hover:text-[#8a6c1a] transition-colors"
    >
      <span className="text-3xl">‹</span>
    </button>
  );

  const NextArrow = (props: any) => (
    <button
      onClick={props.onClick}
      className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white hover:text-[#8a6c1a] transition-colors"
    >
      <span className="text-3xl">›</span>
    </button>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    fade: true, // Smoother transition for text overlays
  };

  return (
    <section className="relative h-full overflow-hidden mt-0">
      {images.length === 0 ? (
        <div className="h-[77vh] md:h-screen flex items-center justify-center text-white text-xl bg-neutral-400">
          No hero images available.
        </div>
      ) : (
        <Slider {...settings}>
          {images.map((img, index) => (
            <div key={img.public_id || index} className="relative h-[77vh] md:h-screen w-full">
              {/* Background Image */}
              <div
                className="absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover z-0"
                style={{
                  backgroundImage: `url(${img.url})`,
                  filter: 'brightness(0.9)', // Slightly darker for better text contrast
                }}
              />
              
              {/* Gradient Overlay for better readability at the bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

              {/* Bottom-Left Text Container */}
              <div className="relative z-20 container  px-6 md:px-10 h-full flex flex-col items-start justify-end pb-16 md:pb-[100px]">
                <h1 className="text-2xl md:text-5xl font-poppins font-bold md:mb-2 text-white border-l-2 border-[#8a6c1a] pl-4  ">
                  {img.title}
                </h1>
                <p className="text-2xl md:text-5xl font-poppins font-semibold mb-2 text-white  pl-4  tracking-wider">
                  {img.subtitle}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      )}

      {/* Scroll indicator */}
      <div className="hidden md:flex absolute bottom-6 right-12 z-30 flex flex-col items-center text-white animate-bounce">
        <span className="text-xs uppercase tracking-widest mb-1 opacity-70">Scroll</span>
        <span className="text-sm">🡣</span>
      </div>
    </section>
  );
};

export default Hero;