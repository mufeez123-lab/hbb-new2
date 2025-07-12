import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import api from '../../services/api'; // adjust path if needed
import '/src/index.css'; // slick-carousel CSS should be globally imported

interface HeroImage {
  url: string;
  public_id: string;
}

const Hero = () => {
  const [images, setImages] = useState<HeroImage[]>([]);

  useEffect(() => {
    api
      .get('/hero')
      .then((res) => {
        if (Array.isArray(res.data?.images)) {
          setImages(res.data.images);
        }
      })
      .catch((err) => console.error('Failed to fetch hero images:', err));
  }, []);

  const PrevArrow = (props: any) => (
    <button
      onClick={props.onClick}
      className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 text-white hover:bg-black/50 rounded-full p-2"
    >
      <ArrowLeft size={24} />
    </button>
  );

  const NextArrow = (props: any) => (
    <button
      onClick={props.onClick}
      className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 text-white hover:bg-black/50 rounded-full p-2"
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
    lazyLoad: 'progressive',
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {images.length === 0 ? (
        <div className="h-screen flex items-center justify-center text-white text-xl bg-neutral-900">
          Loading...
        </div>
      ) : (
        <Slider {...settings}>
          {images.map((img, index) => (
            <div key={img.public_id || index} className="relative h-screen w-full">
              <div
                className="absolute inset-0 bg-cover bg-center w-full h-full z-0"
                style={{
                  backgroundImage: `url(${img.url})`,
                  filter: 'brightness(1.3)',
                }}
              />
              <div className="absolute inset-0 bg-black/50 z-10" />
              <div className="relative z-20 px-4 max-w-4xl mx-auto h-full flex flex-col items-center justify-center text-center text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">

                </h1>
                <p className="text-lg md:text-xl mb-6">

                </p>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </section>
  );
};

export default Hero;
