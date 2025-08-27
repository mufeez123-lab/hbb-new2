import { useEffect, useState } from 'react';
import Slider from 'react-slick';
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
    className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 
               w-10 h-10 flex items-center justify-center 
               rounded-full bg-black/40 hover:bg-black/60 text-white transition"
  >
    <span className="text-xl font-bold">‹</span>
  </button>
);

const NextArrow = (props: any) => (
  <button
    onClick={props.onClick}
    className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 
               w-10 h-10 flex items-center justify-center 
               rounded-full bg-black/40 hover:bg-black/60 text-white transition"
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
    <section className="relative h-[500px] md:h-screen overflow-hidden mt-0 md:mt-0 ">
      {images.length === 0 ? (
        <div className="h-[300px] md:h-screen flex items-center justify-center text-white text-xl bg-neutral-900">
          Loading...
        </div>
      ) : (
        <Slider {...settings}>
          {images.map((img, index) => (
            <div key={img.public_id || index} className="relative h-[500px] md:h-screen w-full">
              <div
                className="absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover  z-0"
                style={{
                  backgroundImage: `url(${img.url})`,
                  filter: 'brightness(1.3)',
                }}
              />
              <div className="absolute inset-0 bg-black/50 z-10" />
              <div className="relative z-20 px-4 max-w-4xl mx-auto h-full flex flex-col items-center justify-center text-center text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {/* Heading goes here */}
                </h1>
                <p className="text-lg md:text-xl mb-6">
                  {/* Subheading or caption goes here */}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      )}
       {/* Scroll Down Suggestion */}
  <div className=" hidden md:flex absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center text-white animate-bounce">
    <span className="text-sm mb-1">🡣</span>
    {/* <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg> */}
  </div>
    </section>
  );
};

export default Hero;
