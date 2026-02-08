import { motion, useScroll, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

interface AboutStats {
  yearsOfExperience: number;
  completedProjects: number;
  happyClients: number;
  awardsWon: number;
}

const CountUpNumber = ({ end }: { end: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / 2000, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end]);

  return (
    <div className="text-4xl md:text-5xl font-light text-neutral-900 mb-2">
      {count}<span className="text-[#8a6c1a]">+</span>
    </div>
  );
};

const AboutPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of this specific section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Transform values: Starts rounded/inset, ends full-width/sharp
  const borderRadius = useTransform(scrollYProgress, [0.3, 0.5], ["40px", "0px"]);
  const scale = useTransform(scrollYProgress, [0.3, 0.5], [0.92, 1]);
  const marginX = useTransform(scrollYProgress, [0.3, 0.5], ["20px", "0px"]);

  const stats: AboutStats = {
    yearsOfExperience: 25,
    completedProjects: 120,
    happyClients: 1500,
    awardsWon: 18,
  };

  return (
    <section ref={containerRef} className="bg-transparent  overflow-hidden">
      <Helmet>
        <title>About | Hindustan Builders</title>
        <meta name="description" content="Learn about Hindustan Builders' legacy of excellence." />
      </Helmet>

      <motion.div
        style={{
          borderRadius,
          scale,
          marginLeft: marginX,
          marginRight: marginX,
        }}
        className="bg-white shadow-2xl py-16 md:py-24 border border-neutral-200 sticky top-0"
      >
        <div className="container mx-auto px-6 md:px-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-sm font-bold tracking-widest uppercase font-poppins text-[#8a6c1a] mb-4"
          >
            About Hindustan Builders
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Left Section */}
            <div className="lg:col-span-2 lg:border-r lg:border-neutral-200 lg:pr-12">
              <h3 className="text-3xl md:text-5xl font-poppins text-neutral-900 font-semibold mb-8 leading-tight">
                Building Landmarks, <br /> 
                <span className="text-[#8a6c1a]">Crafting Lifestyles</span>
              </h3>

              <p className="text-lg text-neutral-600 font-display leading-relaxed mb-8">
                One of India's most trusted and respected names in Real Estate – 
                <strong> Hindustan Builders, Mangalore</strong> is synonymous with innovation 
                and luxurious living. Since its inception, we have played a vital role in shaping 
                the landscape of Modern Urban India through transformative technologies.
              </p>

              <Link
                to="/about"
                className="group inline-flex items-center font-medium font-poppins tracking-tighter text-[#8a6c1a] transition-all"
              >
                EXPLORE OUR LEGACY 
                <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-2" />
              </Link>
            </div>

            {/* Right Section: Stats */}
            <div className="lg:pl-6">
              <div className="grid grid-cols-2 gap-y-12 gap-x-8">
                <div className="text-center font-poppins md:text-left">
                  <CountUpNumber end={stats.yearsOfExperience} />
                  <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mt-2 font-display">Years of Excellence</p>
                </div>

                <div className="text-center font-poppins md:text-left">
                  <CountUpNumber end={stats.completedProjects} />
                  <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mt-2 font-display">Projects Completed</p>
                </div>

                <div className="text-center font-poppins md:text-left">
                  <CountUpNumber end={stats.happyClients} />
                  <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mt-2 font-display">Happy Families</p>
                </div>

                <div className="text-center font-poppins md:text-left">
                  <CountUpNumber end={stats.awardsWon} />
                  <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mt-2 font-display">Awards Won</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutPage;