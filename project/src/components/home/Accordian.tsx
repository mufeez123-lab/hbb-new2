import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  ChevronDown,
  Building2,
  Eye,
  Star,
  Hammer,
} from "lucide-react";

interface AccordionItem {
  title: string;
  content: string;
  icon: React.ReactNode;
}

const accordionData: AccordionItem[] = [
  {
    title: "About Hindustan Builders",
    content:
      "Hindustan Builders is a trusted name in real estate, delivering premium residential and commercial projects with a strong focus on quality, transparency, and customer satisfaction.",
    icon: <Building2 size={20} />,
  },
  {
    title: "Our Vision",
    content:
      "To create sustainable, modern, and elegant spaces that enhance lifestyles while maintaining architectural excellence.",
    icon: <Eye size={20} />,
  },
  {
    title: "Why Choose Us",
    content:
      "• High-quality construction\n• On-time delivery\n• Transparent dealings\n• Customer-first approach",
    icon: <Star size={20} />,
  },
  {
    title: "Our Expertise",
    content:
      "We specialize in residential apartments, villas, commercial buildings, and mixed-use developments.",
    icon: <Hammer size={20} />,
  },
];

const AccordionSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
  <section className="relative py-24 overflow-hidden">
      {/* 1. BACKGROUND IMAGE WITH OVERLAY */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          backgroundImage: 'url("/images/acc.jpg")', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed' // Parallax effect
        }}
      >
        {/* Dark Tint Overlay to ensure text contrast */}
        <div className="absolute inset-0 bg-white/80 lg:bg-white/76 backdrop-blur-md" />
      </div>

      <div className="container relative z-10 mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE CONTENT */}
        <div className="text-center lg:text-left space-y-6">
          <div className="inline-block px-4 py-1 rounded-full bg-[#8a6c1a]/10 text-[#8a6c1a] text-xs font-bold font-poppins tracking-widest uppercase mb-2">
            Since 1995
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-poppins font-light text-gray-900 leading-tight">
            Hindustan Limited
          </h2>

          <div className="w-20 h-1.5 bg-[#8a6c1a] mx-auto lg:mx-0" />

          <p className="text-gray-700 text-xl max-w-md font-display mx-auto lg:mx-0 leading-relaxed">
            Building landmarks with <span className="text-black font-semibold">trust, quality, and innovation</span>. 
            We craft spaces that define modern living and long-term value.
          </p>
          
          {/* Decorative subtle line art element */}
          <div className="hidden lg:block pt-4 opacity-20">
            <svg width="200" height="10" viewBox="0 0 200 10">
               <line x1="0" y1="5" x2="200" y2="5" stroke="#000000" strokeWidth="2" strokeDasharray="8,8" />
            </svg>
          </div>
        </div>

        {/* RIGHT SIDE ACCORDION */}
        <div className="space-y-4">
          {accordionData.map((item, index) => (
            <div
              key={index}
              className={`transition-all duration-300 border ${
                activeIndex === index 
                ? "border--gray-700 bg-white shadow-xl translate-x-2" 
                : "border-gray-200 bg-white/40 backdrop-blur-sm"
              } rounded-2xl overflow-hidden`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-5">
                  <div className={`p-3 rounded-lg transition-colors ${
                    activeIndex === index ? "bg-[#8a6c1a] text-white" : "bg-white text-[#8a6c1a] shadow-sm"
                  }`}>
                    {item.icon}
                  </div>

                  <span className={`text-lg font-semibold font-display tracking-tight ${
                    activeIndex === index ? "text-gray-900" : "text-gray-700"
                  }`}>
                    {item.title}
                  </span>
                </div>

                <ChevronDown
                  className={`text-[#8a6c1a] transition-transform duration-500 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  activeIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 text-gray-600 leading-relaxed font-display text-base">
                  {item.content}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AccordionSection;
