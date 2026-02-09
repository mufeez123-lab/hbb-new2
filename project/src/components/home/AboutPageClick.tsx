import { motion, useScroll, useTransform, useMotionValue, useInView, animate } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useState, useRef, useEffect } from 'react';
import Brands from '../home/Brands';
import Demo from '../ScrollReavel.tsx/Demo';
import Pillars from './Pillars';

/* ------------------ REUSABLE COMPONENTS ------------------ */

/**
 * Smooth Count Up Animation
 */
const CountUpNumber = ({ end, duration = 2.5 }: { end: number; duration?: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, end, {
        duration: duration,
        ease: [0.22, 1, 0.36, 1], // Premium expo ease-out
      });
      return controls.stop;
    }
  }, [isInView, end, count, duration]);

  useEffect(() => {
    return rounded.on("change", (v) => setDisplayValue(v));
  }, [rounded]);

  return (
    <span ref={ref} className="text-4xl md:text-6xl font-display font-light text-[#8a6c1a]">
      {displayValue.toLocaleString()}
      <span className="text-2xl ml-1">+</span>
    </span>
  );
};

/**
 * Accordion-style Reveal Section
 */
const RevealSection = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ 
      duration: 1.2, 
      ease: [0.22, 1, 0.36, 1],
      opacity: { duration: 1.5 } 
    }}
    className="border-t border-gray-100 py-10 group cursor-pointer"
  >
    <div className="flex">
      <h2 className="text-5xl md:text-7xl flex w-full justify-between items-center font-serif text-gray-200 group-hover:text-[#8a6c1a] transition-colors duration-500">
        {title}
        <div className="text-2xl text-gray-500 group-hover:rotate-45 px-8 transition-transform duration-500">+</div>
      </h2>
    </div>
    <div className="hidden group-hover:block mt-6 w-full animate-in fade-in slide-in-from-top-4 duration-700">
      {children}
    </div>
  </motion.div>
);

/* ------------------ MAIN COMPONENT ------------------ */

const AboutPageClick = () => {
  const containerRef = useRef(null);

  const stats = {
    yearsOfExperience: 50,
    completedProjects: 120,
    happyClients: 5000,
    awardsWon: 25
  };

  return (
    <div ref={containerRef} className="bg-white selection:bg-[#8a6c1a] selection:text-white">
      <Helmet>
        <title>About Us | Hindustan Builders</title>
      </Helmet>

      {/* 1. HERO SECTION */}
      <Demo />

      {/* 2. INTRO WITH ASYMMETRIC GRID */}
      <section className="py-24 px-6 md:px-48 bg-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-start mb-24">
          <div className="lg:col-span-5">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-display font-light text-gray-900"
            >
              Building <br /> Excellence for <br /> Generations
            </motion.h3>
          </div>
          
          <div className="lg:col-span-7 lg:pt-4">
            <p className="text-gray-700 font-light leading-relaxed max-w-2xl font-poppins text-base md:text-lg">
              At Hindustan Limited, we pride ourselves on our uncompromising standards. Our focus on 
              craftsmanship and detailing is a part of our legacy, spanning five decades. So while 
              others may consider minor details to be minor, we understand how these little aspects 
              come together to create an extraordinary living experience.
            </p>
          </div>
        </div>

        {/* STATS COUNTER */}
        <div className="lg:pl-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8">
            <div className="text-center md:text-left">
              <CountUpNumber end={stats.yearsOfExperience} />
              <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mt-2">Years of Excellence</p>
            </div>

            <div className="text-center md:text-left">
              <CountUpNumber end={stats.completedProjects} />
              <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mt-2">Projects Completed</p>
            </div>

            <div className="text-center md:text-left">
              <CountUpNumber end={stats.happyClients} />
              <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mt-2">Happy Families</p>
            </div>

            <div className="text-center md:text-left">
              <CountUpNumber end={stats.awardsWon} />
              <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mt-2">Awards Won</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE SECTION ACCORDION */}
      <section className="px-6 md:px-24 py-12">
        <RevealSection title="Our Vision">
          <p className="text-gray-600 font-poppins font-light leading-relaxed max-w-4xl">
            To be the most trusted name in real estate, creating spaces that inspire and elevate human life. 
            We strive to blend architectural excellence with sustainable innovation to redefine modern living. 
            By fostering deep community connections, we transform mere structures into vibrant, lasting homes.
          </p>
        </RevealSection>

        <RevealSection title="Our Mission">
          <p className="text-gray-600 font-poppins font-light leading-relaxed max-w-4xl">
            Delivering excellence through innovation, transparency, and high-quality craftsmanship in every project. 
            We leverage cutting-edge technology to streamline the building process while maintaining meticulous attention to detail.
          </p>
        </RevealSection>

        <RevealSection title="The Brand Pillars">
          <Pillars />
        </RevealSection>
      </section>

      {/* 5. CHAIRMAN QUOTE */}
  <section className="relative py-24 md:py-32 overflow-hidden">
  {/* Background Layer */}
  <div className="absolute inset-0 z-0">
    <img 
      src="/images/abt.jpg" 
      alt="Background" 
      className="w-full h-full object-cover opacity-20" 
    />
    {/* Linear Gradient Overlay: Transitions from white at the top to transparent */}
    <div className="absolute inset-0 bg-gradient-to-b from-white via-white/40 to-transparent h-40" />
    {/* Soft subtle tint to match the image tone */}
    <div className="absolute inset-0 bg-[#fdfcfb]/60" />
  </div>

  <div className=" z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12  items-center">
    
    {/* Left Side: Quote & Signature */}
    <motion.div 
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-start text-left"
    >
      <div className="relative">
        <span className="text-6xl font-serif text-[#8a6c1a] opacity-50 absolute -top-8 -left-4">“</span>
        <h2 className="text-3xl md:text-5xl font-serif leading-tight text-gray-800 mb-8 uppercase tracking-tight">
          Perfection <br />
          is not a dream, <br />
          but a reality <br />
          that I strive <br />
          towards <br />
          in my work
        </h2>
               <span className="text-6xl font-serif text-[#8a6c1a] opacity-50 absolute top-[230px] left-[18rem] -scale-x-100">“</span>
      </div>

      <div className="mt-4">
        <img 
          src="/images/signnature.png" 
          alt="PNC Menon Signature" 
          className="h-16 w-auto grayscale contrast-125 mb-2" 
        />
        <h5 className="font-serif text-xl text-gray-900 tracking-widest uppercase">Mousen Ibrahim</h5>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a6c1a] font-bold">Founder</p>
      </div>
    </motion.div>

    {/* Right Side: Portrait */}
 <motion.div 
  initial={{ opacity: 0, scale: 0.95 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
  className="relative flex justify-center lg:justify-end"
>
  <div className="relative z-10 w-full max-w-md lg:max-w-lg">
    {/* Top Gradient Overlay */}
    <div className="absolute inset-0 z-20 pointer-events-none  from-white via-transparent to-transparent h-40" />
    
    <img 
      src="/images/chairman1.png" 
      alt="PNC Menon" 
      className="w-full h-auto object-cover rounded-full drop-shadow-2xl" 
    />

    {/* Optional: Bottom Gradient Overlay to match the image fade-out in your reference */}
    <div className="absolute inset-x-0 bottom-0 z-20 h-32  from-white to-transparent" />
  </div>
</motion.div>
  </div>
</section>

      <Brands />
    </div>
  );
};

export default AboutPageClick;