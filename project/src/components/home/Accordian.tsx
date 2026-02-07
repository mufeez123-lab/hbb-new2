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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* LEFT SIDE CONTENT */}
        <div className="text-center lg:text-left">
          <h2 className="text-3xl lg:text-4xl font-poppins font-semibold mb-4">
            Hindustan Builders
          </h2>

          <div className="w-20 h-1 bg-[#8a6c1a] mx-auto lg:mx-0 mb-6" />

          <p className="text-gray-600 text-lg  max-w-md font-display mx-auto lg:mx-0">
            Building landmarks with trust, quality, and innovation. We craft
            spaces that define modern living and long-term value.
          </p>
        </div>

        {/* RIGHT SIDE ACCORDION */}
        <div className="space-y-4">
          {accordionData.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  {/* ICON */}
                  <div className="text-[#8a6c1a] ">
                    {item.icon}
                  </div>

                  {/* TITLE */}
                  <span className="font-medium font-display text-gray-800">
                    {item.title}
                  </span>
                </div>

                {/* CHEVRON */}
                <ChevronDown
                  className={`text-[#8a6c1a] transition-transform ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeIndex === index && (
                <div className="px-5 pb-5 text-gray-600 leading-relaxed font-display whitespace-pre-line">
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AccordionSection;
