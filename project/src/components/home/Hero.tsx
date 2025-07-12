import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import api from '../../services/api'; // adjust path as needed
import '/src/index.css'; // assuming slick-carousel CSS is imported globally

const Hero = () => {
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/hero')
      .then((res) => {
        if (res.data?.backgroundImage?.url) {
          setHeroImage(res.data.backgroundImage.url);
        }
      })
      .catch((err) => console.error('Failed to fetch hero image:', err));
  }, []);

  const PrevArrow = (props: any) => (
    <button
      onClick={props.onClick}
      className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 text-white bg-black/30 hover:bg-black/50 rounded-full p-2"
    >
      <ArrowLeft size={24} />
    </button>
  );

  const NextArrow = (props: any) => (
    <button
      onClick={props.onClick}
      className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 text-white bg-black/30 hover:bg-black/50 rounded-full p-2"
    >
      <ArrowRight size={24} />
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
  };

  return (
    <section className="relative h-[70vh] overflow-hidden">
      <Slider {...settings}>
        {heroImage && (
          <div className="relative h-[70vh] w-full">
            <div
              className="absolute inset-0 bg-cover bg-center w-full h-full z-0"
              style={{
                backgroundImage: `url(${heroImage})`,
                filter: 'brightness(1.3)',
              }}
            />
            <div className="absolute inset-0 bg-black/50 z-10" />
            <div className="relative z-20 px-4 max-w-4xl mx-auto h-full flex flex-col items-center justify-center text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {/* Welcome to Hindustan Builders */}
              </h1>
              <p className="text-lg mb-6">
                {/* Building Excellence. Crafting Dreams. */}
              </p>
            </div>
          </div>
        )}
      </Slider>
    </section>
  );
};

export default Hero;
