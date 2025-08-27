import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import api from '../../services/api'; // adjust path if needed
import '/src/index.css'; // slick-carousel CSS should be globally imported

interface HeroImage {
  url: string;
  public_id: string;
}

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }, [query]);

  return matches;
};

const Hero = () => {
  const [desktopImages, setDesktopImages] = useState<HeroImage[]>([]);
  const [mobileImages, setMobileImages] = useState<HeroImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const imagesToDisplay = isMobile ? mobileImages : desktopImages;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const [desktopRes, mobileRes] = await Promise.all([
          api.get('/hero/desktop'),
          api.get('/hero/mobile'),
        ]);

        if (Array.isArray(desktopRes.data.images)) {
          setDesktopImages(desktopRes.data.images);
        }
        if (Array.isArray(mobileRes.data.images)) {
          setMobileImages(mobileRes.data.images);
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
      className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 
                 w-10 h-10 flex items-center justify-center 
                 text-white "
    >
      <span className="text-xl font-bold">‹</span>
    </button>
  );

  const NextArrow = (props: any) => (
    <button
      onClick={props.onClick}
      className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 
                 w-10 h-10 flex items-center justify-center 
                 text-white "
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
      {isLoading ? (
        <div className="h-[500px] md:h-screen flex items-center justify-center text-white text-xl bg-neutral-900">
          Loading...
        </div>
      ) : imagesToDisplay.length === 0 ? (
        <div className="h-[500px] md:h-screen flex items-center justify-center text-white text-xl bg-neutral-900">
          No hero images available.
        </div>
      ) : (
        <Slider {...settings}>
          {imagesToDisplay.map((img, index) => (
            <div key={img.public_id || index} className="relative h-[500px] md:h-screen w-full">
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
      <div className=" hidden md:flex absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center text-white animate-bounce">
        <span className="text-sm mb-1">🡣</span>
      </div>
    </section>
  );
};

export default Hero;