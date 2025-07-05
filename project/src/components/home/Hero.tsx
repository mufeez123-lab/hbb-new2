import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import '/src/index.css';

const Hero = () => {
  const images = [
    '/images/image3.jpg',
    '/images/3159182.jpg',
    '/images/image1.jpg',
    '/images/393076.jpg',
    '/images/3159227.jpg',
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startSlideshow = () => {
    intervalRef.current = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 10000); // 10 seconds
  };

  const resetSlideshow = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    startSlideshow();
  };

  useEffect(() => {
    startSlideshow();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const goToPrevious = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    resetSlideshow();
  };

  const goToNext = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
    resetSlideshow();
  };

  return (
    <section className="relative h-[70vh] flex items-center justify-center text-center pt-28">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center w-full h-full z-0 transition-all duration-700"
        style={{
          backgroundImage: `url(${images[currentImage]})`,
          filter: 'brightness(1.3)',
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Centered Content */}
      <div className="relative z-20 px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {/* Welcome to Hindustan Bawa Builders */}
        </h1>
        <p className="text-lg text-white mb-6">
          {/* Building Excellence. Crafting Dreams. */}
        </p>
      </div>

      {/* Left/Right Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 text-white bg-black/30 hover:bg-black/50 rounded-full p-2"
        aria-label="Previous Slide"
      >
        <ArrowLeft size={24} />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 text-white bg-black/30 hover:bg-black/50 rounded-full p-2"
        aria-label="Next Slide"
      >
        <ArrowRight size={24} />
      </button>
    </section>
  );
};

export default Hero;
