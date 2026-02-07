import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import crisilLogo from '/logo-SVG.svg';

interface AboutStats {
  yearsOfExperience: number;
  completedProjects: number;
  happyClients: number;
  awardsWon: number;
}

interface CountUpNumberProps {
  end: number;
}

const CountUpNumber = ({ end }: CountUpNumberProps) => {
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
    <div className="text-5xl font-light text-neutral-900 font-playfair mb-2">
      {count}
      <span className="text-[#8a6c1a]">+</span>
    </div>
  );
};

const AboutPage = () => {
  // 👉 FRONTEND STATIC DATA
  const stats: AboutStats = {
    yearsOfExperience: 25,
    completedProjects: 120,
    happyClients: 1500,
    awardsWon: 18,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white py-0"
    >
      <Helmet>
        <meta
          name="description"
          content="Learn about Hindustan Builders' legacy of excellence in real estate development, our values, and commitment to quality construction."
        />
      </Helmet>

      <div className="container mx-auto px-6 mb-0">
        <h2
          className="text-sm font-bold font-poppins tracking-widest uppercase text-[#8a6c1a] mb-2 ml-20 sm:mt-10 
          text-center sm:text-left sm:ml-28"
        >
          About Hindustan Builders
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="lg:col-span-2 border-r border-neutral-300 pr-6 pl-4">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={crisilLogo}
                alt="CRISIL Logo"
                className="h-12 w-auto object-contain"
              />
              <div className="w-[0.5px] h-10 bg-[#8A6C4B] ml-2"></div>
              <h3 className="text-xl md:text-2xl font-poppins text-neutral-900 -ml-2">
                Building Landmarks, Crafting Lifestyles
              </h3>
            </div>

            <p className="text-base text-neutral-600 leading-relaxed mb-4">
              One of India's most trusted and respected names in Real Estate – Hindustan Builders, Mangalore is synonymous with innovation and luxurious living. Since its inception, Hindustan Builders has played a vital role in shaping the landscape of Modern Urban India by consistently introducing and delivering state-of-the-art, transformative real estate concepts, technologies, and innovations.
            </p>

            <Link
              to="/aboutclick"
              className="inline-flex items-center text-[#8a6c1a] hover:underline mt-2"
            >
              SEE MORE <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>

          {/* Right Section: Stats */}
          <div className="lg:pl-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <CountUpNumber end={stats.yearsOfExperience} />
                <p className="text-neutral-600 text-sm">Years of Excellence</p>
              </div>

              <div className="text-center">
                <CountUpNumber end={stats.completedProjects} />
                <p className="text-neutral-600 text-sm">Projects Completed</p>
              </div>

              <div className="text-center">
                <CountUpNumber end={stats.happyClients} />
                <p className="text-neutral-600 text-sm">Happy Families</p>
              </div>

              <div className="text-center">
                <CountUpNumber end={stats.awardsWon} />
                <p className="text-neutral-600 text-sm">Awards Won</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutPage;
