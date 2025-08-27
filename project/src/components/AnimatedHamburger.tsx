import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Path = ({ stroke, ...props }: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="1.5"
    stroke={stroke}
    strokeLinecap="round"
    {...props}
  />
);

const AnimatedHamburger = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // change color after scrolling 50px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button onClick={toggle} aria-label="Toggle menu" className="z-50">
      <svg width="24" height="24" viewBox="0 0 23 23">
        <Path
          stroke={isScrolled ? "black" : "white"}
          variants={{
            closed: { d: "M 2 2.5 L 20 2.5" },
            open: { d: "M 3 16.5 L 17 2.5" },
          }}
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.3 }}
        />
        <Path
          stroke={isScrolled ? "black" : "white"}
          d="M 2 9.423 L 20 9.423"
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
            closed: { d: "M 2 16.346 L 20 16.346" },
            open: { d: "M 3 2.5 L 17 16.5" },
          }}
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.3 }}
        />
      </svg>
    </button>
  );
};

export default AnimatedHamburger;
