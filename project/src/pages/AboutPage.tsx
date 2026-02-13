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

  // const stats: AboutStats = {
  //   yearsOfExperience: 25,
  //   completedProjects: 120,
  //   happyClients: 1500,
  //   awardsWon: 18,
  // };

  return (
<section 
  ref={containerRef} 
  className="relative overflow-hidden bg-cover bg-center bg-no-repeat py-0 md:py-20"
  style={{ 
    backgroundImage: `linear-gradient(
      to right, 
      white 0%, 
      rgba(255, 255, 255, 0.9) 30%, 
      transparent 70%
    ), url('/images/abt3.png')` 
  }}
> 

      <motion.div
        style={{
          borderRadius,
          scale,
          marginLeft: marginX,
          marginRight: marginX,
        }}
        className="bg-transparent  py-16 md:py-24  sticky top-0 min-h-[70vh] flex items-center"
      >
        <div className="container max-w-[190vh] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content Section */}
            <div className="z-10">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-sm font-bold tracking-[0.3em] uppercase font-poppins text-[#8a6c1a] mb-6"
              >
                
              </motion.h2>

              <h3 className="text-4xl md:text-6xl font-light text-neutral-900 mb-8 leading-[1.1] font-poppins">
                A Legacy of <br /> 
                <span className="italic font-serif">Architectural </span> <span className="font-semibold uppercase tracking-tighter ">Exactitude</span>
              </h3>

              <p className="text-base md:text-lg text-neutral-600 font-poppins font-light leading-relaxed mb-10 max-w-xl">
              At <strong> Hindustan Holdings</strong>, precision is our tradition. Since 1984, we have executed every blueprint with uncompromising accuracy, ensuring that complex architectural visions are transformed into enduring realities through rigorous, flawless construction.
              </p>

              <Link
                to="/about"
                className="group inline-flex items-center tracking-[0.2em] text-xs font-bold font-poppins border border-neutral-900 rounded-full px-10 py-4   transition-all duration-500"
              >
                DISCOVER MORE
                <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Right Image Section - Blended Design */}
            {/* <div className="relative h-[350px] lg:h-[550px] w-full lg:pl-6">
               This gradient creates the "Art of Detail" fade effect
               <div className="absolute inset-0 bg-gradient-to-r from-white via-white/10 to-transparent z-10 hidden lg:block" />
               <img 
                 src="/images/img1.jpg" 
                 alt="Detail Craftsmanship" 
                 className="w-full h-full object-cover grayscale-[10%] opacity-95" 
               />
            </div> */}

            {/* Right Section: Stats (KEEPING COMMENTED AS REQUESTED) */}
            {/* <div className="lg:pl-6">
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
            </div> */}
            
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutPage;