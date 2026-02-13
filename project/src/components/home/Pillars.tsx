
import React from 'react';

interface PillarProps {
  imageSrc: string;
  title: string;
  description: string;
  imageAlt: string;
  hoverText: string; // New property for unique hover text
}

const Pillar: React.FC<PillarProps> = ({ imageSrc, title, description, imageAlt, hoverText }) => (
  <div className="flex flex-col flex-1 mb-12 md:mb-0 border-r px-2">
    <div className="relative overflow-hidden mb-8  aspect-[4/5] group cursor-pointer">
      
      {/* Image */}
      <img 
        src={imageSrc} 
        alt={imageAlt} 
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 rounded-[20px] transition-all duration-700 ease-in-out group-hover:scale-110" 
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Unique Hover Text */}
      <div className="absolute inset-0 flex items-end justify-center py-8 px-6 pointer-events-none">
        <span className="text-white text-2xl md:text-2xl font-ptserif  italic  transform translate-y-16 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-out">
         " {hoverText}"
        </span>
      </div>

    </div>

    <div className="max-w-xs">
      <h3 className="text-3xl font-display text-gray-800 mb-4 leading-tight">
        {title}
      </h3>
      <p className="text-[15px] text-gray-600 font-poppins leading-relaxed font-light">
        {description}
      </p>
    </div>
  </div>
);
const SobhaPillars: React.FC = () => {
  const pillars = [
    {
      title: "Signature Quality",
      hoverText: "Materials that endure. Standards that inspire.", // Text shown on hover
      imageSrc: "/images/a2.jpeg", // Example Architecture
      imageAlt: "Intricate architectural details",
      description: "For us Quality is the bedrock of our reputation. We enforce rigorous quality control protocols at every stage of construction, ensuring that the structural integrity of our buildings is absolute. We build assets that retain their value."
    },
    {
      title: "Thoughtful Design",
      hoverText: "Architecture shaped by human experience.", // Text shown on hover
      imageSrc: "/images/a3.jpeg", // Example Designer
      imageAlt: "Designer working on plans",
      description: "At HINDUSTAN, We approach design with a problem-solving mindset. By harmonizing aesthetics with functional engineering, spaces are well-utilised and optimize efficiency. The result is a seamless environment where form perfectly follows function."
    },
    {
      title: "Enduring Craftsmanship",
      hoverText: "Four decades of mastery in every build", // Text shown on hover
      imageSrc: "/images/a1.jpeg", // Example Woodwork
      imageAlt: "Hands sanding fine wood",
      description: "AT HINDUSTAN, Construction is a discipline of precision. Drawing on over four decades of experience, we execute complex architectural details with exactitude. We don’t just build for the handover; we build for the next generation."
    }
  ];

  return (
    <section className="bg-gray-50 py-16 px-6 md:px-12 lg:px-24">
      <div className=" mx-auto">
        <header className="flex items-center mb-16">
          <div className="flex-grow h-px bg-gray-300"></div>
          <h2 className="px-6 text-lg uppercase tracking-[0.2em] font-medium text-gray-800 text-center">
            From Concept to Completion: Defining Our Pillars
          </h2>
          <div className="flex-grow h-px bg-gray-300"></div>
        </header>

        <div className="flex flex-col md:flex-row md:space-x-8 border-r border-b border-l bo lg:space-x-12">
          {pillars.map((pillar, index) => (
           <div 
              key={index} 
              className={`flex-1 ${index === 1 ? 'md:mt-20' : ''}`} // Adds top margin to the middle item on desktop
            >
            <Pillar key={index} {...pillar} />
            </div> 
          ))}
        </div>
      </div>
    </section>
  );
};

export default SobhaPillars;