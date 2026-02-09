import { motion, useScroll, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Brands from '../home/Brands';
import Demo from '../ScrollReavel.tsx/Demo';

/* ------------------ REUSABLE COMPONENTS ------------------ */

const RevealSection = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="border-t border-gray-100 py-10 group cursor-pointer"
  >
    <div className="flex justify-between items-center">
      <h2 className="text-5xl md:text-7xl font-serif text-gray-200 group-hover:text-[#8a6c1a] transition-colors duration-500">
        {title}
      </h2>
      <div className="text-2xl text-gray-300 group-hover:rotate-45 transition-transform duration-500">+</div>
    </div>
    <div className="hidden group-hover:block mt-6 max-w-2xl">
      {children}
    </div>
  </motion.div>
);

/* ------------------ MAIN COMPONENT ------------------ */

const AboutPageClick = () => {
  const containerRef = useRef(null);
  
  // Parallax for Hero
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <div ref={containerRef} className="bg-white selection:bg-[#8a6c1a] selection:text-white">
      <Helmet>
        <title>About Us | Hindustan Builders</title>
      </Helmet>

      {/* 1. SOBHA STYLE HERO */}
    <Demo/>
    

      {/* 2. INTRO WITH ASYMMETRIC GRID */}
      <section className="py-24 px-6 md:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-3xl font-serif leading-tight text-gray-900"
            >
              Building <br /> Excellence for <br /> Generations
            </motion.h3>
          </div>
          <div className="lg:col-span-8">
            <p className="text-gray-500 font-light leading-loose max-w-xl text-sm md:text-base">
              Hindustan Builders is a real estate developer that stands for quality and trust. 
              Since 1995, we have been reshaping the skyline of Mangaluru with 
              transformative technologies and an unwavering commitment to luxury living.
            </p>
            
            {/* Quick Stats Row */}
            <div className="grid grid-cols-3 gap-8 mt-16 border-t border-gray-100 pt-10">
              <div>
                <span className="text-2xl font-serif text-gray-900">~8Mn</span>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">Sq. Ft Developed</p>
              </div>
              <div>
                <span className="text-2xl font-serif text-gray-900">~3000</span>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">Homes Built</p>
              </div>
              <div>
                <span className="text-2xl font-serif text-gray-900">~10%</span>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">Market Share</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE SECTION ACCORDION (Sobha Vision/Mission) */}
      <section className="px-6 md:px-24 py-12">
        <RevealSection title="Our Vision">
          <p className="text-gray-600 font-light">To be the most trusted name in real estate, creating spaces that inspire and elevate human life.</p>
        </RevealSection>
        <RevealSection title="Our Mission">
          <p className="text-gray-600 font-light">Delivering excellence through innovation, transparency, and high-quality craftsmanship in every project.</p>
        </RevealSection>
        <RevealSection title="The Brand Pillars">
          <p className="text-gray-600 font-light">Integrity, Quality, and Timely Delivery are the cornerstones of our legacy.</p>
        </RevealSection>
      </section>

      {/* 4. HORIZONTAL JOURNEY TIMELINE */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-6 mb-12">
          <span className="text-[10px] uppercase tracking-[0.4em] text-gray-400 block mb-2">Our Journey</span>
          <h2 className="text-3xl font-serif italic">A Journey Through Time,</h2>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-12 px-6 no-scrollbar">
          {[1976, 1995, 2003, 2014, 2016].map((year, idx) => (
            <motion.div 
              key={year}
              whileHover={{ scale: 1.02 }}
              className={`flex-shrink-0 w-[300px] md:w-[450px] relative h-[300px] md:h-[400px] group overflow-hidden`}
            >
              <img 
                src={`/images/journey-${idx+1}.jpg`} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                alt={year.toString()}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-10 left-10 text-white">
                <h4 className="text-4xl font-serif mb-2">{year}</h4>
                <p className="text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Key Milestone Reached</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. CHAIRMAN QUOTE (Sobha Style) */}
      <section className="py-32 flex flex-col items-center justify-center bg-white text-center px-6">
        <div className="max-w-4xl">
          <p className="text-xl md:text-3xl font-serif italic text-gray-800 leading-relaxed mb-10">
            "Perfection is not a dream, but a reality that I strive towards in my work."
          </p>
          <img src="/images/chairman-signature.png" alt="Signature" className="h-12 opacity-40 mx-auto" />
          <div className="mt-12 flex flex-col items-center">
             <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-[#8a6c1a] p-1">
                <img src="/images/chairman.jpg" className="w-full h-full object-cover rounded-full" alt="Chairman" />
             </div>
             <h5 className="font-serif text-lg text-gray-900">Mr. Name Surname</h5>
             <span className="text-[10px] uppercase tracking-widest text-gray-400">Founder & Chairman</span>
          </div>
        </div>
      </section>

      <Brands />
    </div>
  );
};

export default AboutPageClick;