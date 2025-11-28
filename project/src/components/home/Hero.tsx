import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import api from '../../services/api'; 
import '/src/index.css'; 

interface HeroImage {
  url: string;
  public_id: string;
}

const Hero = () => {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await api.get('/hero');  // only fetch once
        if (Array.isArray(res.data.images)) {
          setImages(res.data.images);
        }
      } catch (err) {
        console.error('Failed to fetch hero images:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  const PrevArrow = (props: any) => (
    <button
      onClick={props.onClick}
      className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white"
    >
      <span className="text-xl font-bold">‹</span>
    </button>
  );

  const NextArrow = (props: any) => (
    <button
      onClick={props.onClick}
      className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-white"
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
    <section className="relative h-[77vh]  overflow-hidden mt-0">
      {isLoading ? (
        <div className="h-[77vh] md:h-screen flex items-center justify-center text-white text-xl bg-neutral-900">
          Loading...
        </div>
      ) : images.length === 0 ? (
        <div className="h-[500px] md:h-screen flex items-center justify-center text-white text-xl bg-neutral-400">
          No hero images available.
        </div>
      ) : (
        <Slider {...settings}>
          {images.map((img, index) => (
            <div key={img.public_id || index} className="relative h-[77vh] md:h-screen w-full">
              <div
                className="absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover lg:bg-cover z-0"
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

      {/* scroll down indicator */}
      <div className="hidden md:flex absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center text-white animate-bounce">
        <span className="text-sm mb-1">🡣</span>
      </div>
    </section>
  );
};

export default Hero;
