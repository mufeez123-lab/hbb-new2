import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import Brands from '../home/Brands';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface DirectorImage {
  url: string;
  public_id: string;
}

interface Director {
  _id: string;
  name: string;
  position: string;
  image: string | DirectorImage;
  order: number;
  isActive: boolean;
}

interface AboutStats {
  yearsOfExperience: number;
  completedProjects: number;
  happyClients: number;
  awardsWon: number;
}

interface CountUpNumberProps {
  end: number;
  suffix?: string;
}

/* ------------------ STATIC FRONTEND DATA ------------------ */

const mockStats: AboutStats = {
  yearsOfExperience: 22,
  completedProjects: 120,
  happyClients: 950,
  awardsWon: 18,
};

const mockDirectors: Director[] = [
  {
    _id: '1',
    name: 'Mr. A. Rahman',
    position: 'Chairman',
    image: '/images/c.png',
    order: 1,
    isActive: true,
  },
  {
    _id: '2',
    name: 'Mr. S. Khan',
    position: 'Managing Director',
    image: '/images/c.png',
    order: 2,
    isActive: true,
  },
  {
    _id: '3',
    name: 'Ms. R. Shaikh',
    position: 'Executive Director',
    image: '/images/c.png',
    order: 3,
    isActive: true,
  },
  {
    _id: '4',
    name: 'Mr. N. Patel',
    position: 'Director – Projects',
    image: '/images/c.png',
    order: 4,
    isActive: true,
  },
];

/* ------------------ COUNT UP COMPONENT ------------------ */

const CountUpNumber = ({ end, suffix = '' }: CountUpNumberProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / 2000, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end]);

  return (
    <div className="text-5xl font-light text-neutral-900 mb-2">
      {count}
      <span className="text-[#8a6c1a] font-light">{suffix}</span>
    </div>
  );
};

/* ------------------ MAIN COMPONENT ------------------ */

const AboutPageClick = () => {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [stats, setStats] = useState<AboutStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setDirectors(mockDirectors);
      setStats(mockStats);
      setLoading(false);
    }, 500);
  }, []);

  /* ------------------ SLIDER ARROWS ------------------ */

  const PrevArrow = (props: any) => (
    <button
      onClick={props.onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-20 text-3xl text-neutral-700 hover:text-[#8a6c1a] transition"
    >
      ‹
    </button>
  );

  const NextArrow = (props: any) => (
    <button
      onClick={props.onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-20 text-3xl text-neutral-700 hover:text-[#8a6c1a] transition"
    >
      ›
    </button>
  );

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white pb-2 pt-32 py-10"
    >
      <Helmet>
        <title>About Us | Hindustan Builders</title>
        <meta
          name="description"
          content="Learn about Hindustan Builders' legacy of excellence in real estate development."
        />
      </Helmet>

      {/* HERO */}
      <section className="py-10 -mt-[75px]">
    <div
  className="relative px-4 w-full h-[300px] flex flex-col items-center justify-center bg-center bg-cover"
  style={{
    backgroundImage:
      "linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(160, 160, 160, 0.3)), url('/images/image3.jpg')",
  }}
>
  <h1 className="text-4xl font-extrabold text-center uppercase text-white">
    About Us
  </h1>

  {/* Breadcrumb */}
  <div className="mt-2 text-sm text-white/80">
    <Link to="/" className="font-display hover:text-white transition">
      Home
    </Link>
    <span className="mx-2">/</span>
    <span className="text-white font-medium font-display">About Us</span>
  </div>
</div>

        
      </section>

      {/* ABOUT CONTENT */}
      <div className="container mx-auto px-4 mt-22">
       <h2
          className="text-sm font-bold font-display tracking-widest uppercase text-[#8a6c1a] mb-4 ml-0  
           "
        >
          About Hindustan Builders
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <h3 className="text-xl md:text-4xl mb-2 font-poppins text-neutral-900 font-semibold ">
                Building Landmarks, <br /> <span>Crafting Lifestyles</span>
              </h3>

            <p className="text-base text-neutral-600 font-display leading-relaxed mb-3">
           One of India's most trusted and respected names in Real Estate – Hindustan Builders, Mangalore is synonymous with innovation and luxurious living. Since its inception, Hindustan Builders has played a vital role in shaping the landscape of Modern Urban India by consistently introducing and delivering state-of-the-art, transformative real estate concepts, technologies, and innovations.
            </p>
          </div>

          {/* <div className="lg:col-span-1 border-l border-neutral-300 pl-4">
            {stats && (
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center font-display">
                  <CountUpNumber end={stats.yearsOfExperience} suffix="+" />
                  <p className="text-sm text-neutral-600">Years of Excellence</p>
                </div>
                <div className="text-center font-display">
                  <CountUpNumber end={stats.completedProjects} suffix="+" />
                  <p className="text-sm text-neutral-600">Projects Completed</p>
                </div>
                <div className="text-center   font-display">
                  <CountUpNumber end={stats.happyClients} suffix="+" />
                  <p className="text-sm text-neutral-600">Happy Families</p>
                </div>
                <div className="text-center font-display">
                  <CountUpNumber end={stats.awardsWon} suffix="+" />
                  <p className="text-sm text-neutral-600">Awards Won</p>
                </div>
              </div>
            )}
          </div> */}
          <div className="lg:col-span-1 border-l border-neutral-300 pl-4 flex items-center justify-center">
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8 }}
    className="relative w-full h-full min-h-[300px]"
  >
    <img
      src="/images/about-excellence.jpg" // Replace with your actual image path
      alt="Hindustan Builders Excellence"
      className="w-full h-full object-cover rounded-lg shadow-md"
      onError={(e) => {
        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000'; // Fallback high-quality building image
      }}
    />
    {/* Optional Overlay Tag */}
    <div className="absolute bottom-4 left-4 bg-[#8a6c1a]/90 text-white px-4 py-2 rounded text-sm font-poppins">
      Building Dreams Since 1995
    </div>
  </motion.div>
</div>
        </div>

        {/* BOARD OF DIRECTORS */}
        <div className="mt-20">
          <h2 className="text-2xl text-center font-poppins font-bold uppercase mb-6">
            Board of Directors
          </h2>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <Slider {...sliderSettings} className="relative px-8">
              {directors.map((director) => {
                const imageURL =
                  typeof director.image === 'string'
                    ? director.image
                    : director.image.url;

                return (
                  <Link
                    to={`/board/${director._id}`}
                    key={director._id}
                    className="block px-2"
                  >
                    <div className="bg-white border rounded-lg overflow-hidden">
                      <div className="h-80 bg-neutral-100 p-1">
                        <img
                          src={imageURL}
                          alt={director.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="p-3 text-center">
                        <h4 className="text-lg font-semibold text-[#8a6c1a]">
                          {director.name}
                        </h4>
                        <p className="text-sm text-neutral-600">
                          {director.position}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </Slider>
          )}
        </div>
      </div>

      <Brands />
    </motion.div>
  );
};

export default AboutPageClick;
