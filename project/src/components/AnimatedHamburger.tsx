import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Path = ({ stroke, ...props }: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="2" 
    stroke={stroke}
    strokeLinecap="round"
    {...props}
  />
);

const AnimatedHamburger = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 250); 
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button onClick={toggle} aria-label="Toggle menu" className="z-50">
      {/* ✅ Reduced height for a flatter look */}
      <svg width="28" height="20" viewBox="0 0 23 18">
        <Path
          stroke={isScrolled ? "black" : "white"}
          variants={{
            closed: { d: "M 2 3 L 20 3" },   // moved closer
            open: { d: "M 3 15 L 17 3" },
          }}
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.3 }}
        />
        <Path
          stroke={isScrolled ? "black" : "white"}
          d="M 2 9 L 20 9"   // middle line closer
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 0 },
          }}
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.3 }}
        />
        <Path
          stroke={isScrolled ? "black" : "white"}
          variants={{
            closed: { d: "M 2 15 L 20 15" }, // bottom line closer
            open: { d: "M 3 3 L 17 15" },
          }}
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.3 }}
        />
      </svg>
    </button>
  );
};

export default AnimatedHamburger;
