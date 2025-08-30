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
      setIsScrolled(window.scrollY > 400); 
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
   <button onClick={toggle} aria-label="Toggle menu" className="z-50">
  <svg width="34" height="20" viewBox="0 0 24 18"> {/* increased width */}
    <Path
      stroke={isScrolled ? "black" : "black"}
      strokeWidth="1"  // thinner line
      strokeLinecap="round"
      variants={{
        closed: { d: "M -2 3 L 20 3" },
        open: { d: "M 3 15 L 17 3" },
      }}
      animate={isOpen ? "open" : "closed"}
      transition={{ duration: 0.3 }}
    />
    <Path
      stroke={isScrolled ? "black" : "black"}
      strokeWidth="1"
      strokeLinecap="round"
      d="M 2 9 L 20 9"
      variants={{
        closed: { opacity: 1 },
        open: { opacity: 0 },
      }}
      animate={isOpen ? "open" : "closed"}
      transition={{ duration: 0.3 }}
    />
    <Path
      stroke={isScrolled ? "black" : "black"}
      strokeWidth="1"
      strokeLinecap="round"
      variants={{
        closed: { d: "M -2 15 L 20 15" },
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
