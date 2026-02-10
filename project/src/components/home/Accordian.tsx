import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Eye, Star, Hammer, ArrowRight } from "lucide-react";

const AccordionSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const items = [
    {
      title: "Our Heritage",
      desc: "Since 1995, delivering premium residential and commercial excellence.",
      icon: <Building2 />,
      img: "/images/img1.jpg" // Optional: unique bg for each
    },
    {
      title: "The Vision",
      desc: "Creating sustainable, modern spaces that redefine architectural beauty.",
      icon: <Eye />,
      img: "/images/img1.jpg"
    },
    {
      title: "Our Quality",
      desc: "High-quality construction and on-time delivery are our core pillars.",
      icon: <Star />,
      img: "/images/img1.jpg"
    },
    {
      title: "Expertise",
      desc: "From luxury villas to commercial hubs, we build with precision.",
      icon: <Hammer />,
      img: "/images/img1.jpg"
    }
  ];

  return (
    <section className="py-16 bg-white text-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-sm uppercase tracking-[0.4em] text-[#8a6c1a] font-bold mb-4">
            The Hindustan Standard
          </h2>
          <p className="text-4xl font-display text-black font-light max-w-2xl">
            We don't just build structures; we curate <span className="italic">experiences.</span>
          </p>
        </div>

        <div className="flex flex-col lg:flex-row h-[900px] lg:h-[500px] gap-4">
          {items.map((item, index) => (
            <motion.div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500"
              animate={{
                flex: hoveredIndex === index ? 2 : 1,
              }}
              style={{
                background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(${item.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Overlay for glass effect */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className={`w-12 h-12 rounded-full border border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-md transition-colors ${hoveredIndex === index ? "bg-[#8a6c1a] border-transparent" : ""}`}>
                  {item.icon}
                </div>

                <div>
                  <h3 className="text-2xl font-poppins font-semibold mb-3">{item.title}</h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: hoveredIndex === index ? 1 : 0,
                      y: hoveredIndex === index ? 0 : 20 
                    }}
                    className="text-gray-300 font-poppins leading-relaxed max-w-xs"
                  >
                    {item.desc}
                  </motion.p>
                  
             
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccordionSection;