
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
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-white text-2xl md:text-3xl font-serif tracking-[0.3em] uppercase transform translate-y-12 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-out">
          {hoverText}
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
      title: "Craftsmanship",
      hoverText: "Artistry", // Text shown on hover
      imageSrc: "/images/p1.webp", // Example Architecture
      imageAlt: "Intricate architectural details",
      description: "When building a house, attention to detail is essential. Sobha recognises this, and we pay attention to every detail, whether it's the quality of the materials, textures and finishes, door hinges, doors, floor tiling, bathroom flooring, fittings or window size. A true craftsman for a harmonious life."
    },
    {
      title: "Thoughtful Design",
      hoverText: "Excellence", // Text shown on hover
      imageSrc: "https://images.unsplash.com/photo-1507206130118-b5907f817163?auto=format&fit=crop&q=80&w=800", // Example Designer
      imageAlt: "Designer working on plans",
      description: "At Sobha, home design is not just a structure; it's a beautiful piece of art. Homes that are spacious with well-utilised spaces. The design is carefully considered and subjected to severe quality inspections. We consider every stage of construction to ensure a thoughtful design."
    },
    {
      title: "Signature Quality",
      hoverText: "Lifestyles", // Text shown on hover
      imageSrc: "/images/image3.jpg", // Example Woodwork
      imageAlt: "Hands sanding fine wood",
      description: "At Sobha, we are involved in every stage of the process, from material sourcing to building homes. Every home built by us is subjected to a material quality inspection. All of the items used in the construction are manufactured by us, allowing complete control over the quality of the products utilised."
    }
  ];

  return (
    <section className="bg-gray-50 py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center mb-16">
          <div className="flex-grow h-px bg-gray-300"></div>
          <h2 className="px-6 text-lg uppercase tracking-[0.2em] font-medium text-gray-800 text-center">
            From Concept to Completion: Defining Our Pillars
          </h2>
          <div className="flex-grow h-px bg-gray-300"></div>
        </header>

        <div className="flex flex-col md:flex-row md:space-x-8 border-r border-b border-l bo lg:space-x-12">
          {pillars.map((pillar, index) => (
            <Pillar key={index} {...pillar} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SobhaPillars;