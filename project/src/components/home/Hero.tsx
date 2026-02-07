import { useState } from 'react';
import Slider from 'react-slick';
import '/src/index.css';

interface HeroImage {
  url: string;
  public_id: string;
}

const Hero = () => {
  // 👉 Frontend images (local or CDN)
  const [images] = useState<HeroImage[]>([
    {
      url: '/images/image3.jpg',
      public_id: 'hero-1',
    },
    {
      url: '/images/img1.jpg',
      public_id: 'hero-2',
    },
    {
      url: '/images/image1.jpg',
      public_id: 'hero-3',
    },
  ]);

  const PrevArrow = (props: any) => (
    <button
      onClick={props.onClick}
      className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white"
    >
      <span className="text-xl font-bold">‹</span>
    </button>
  );

  const NextArrow = (props: any) => (
    <button
      onClick={props.onClick}
      className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white"
    >
      <span className="text-xl font-bold">›</span>
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
    lazyLoad: 'progressive',
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
              <div
                className="absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover z-0"
                style={{
                  backgroundImage: `url(${img.url})`,
                  filter: 'brightness(1.3)',
                }}
              />
              <div className="absolute inset-0 bg-black/50 z-10" />

              <div className="relative z-20 px-4 max-w-4xl mx-auto h-full flex flex-col items-center justify-center text-center text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {/* Heading */}
                </h1>
                <p className="text-lg md:text-xl mb-6">
                  {/* Subheading */}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      )}

      {/* Scroll indicator */}
      <div className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center text-white animate-bounce">
        <span className="text-sm mb-1">🡣</span>
      </div>
    </section>
  );
};

export default Hero;
