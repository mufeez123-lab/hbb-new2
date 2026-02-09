import { useEffect, useRef } from "react";

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Update position using requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        if (cursor) {
          cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        }
      });
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="
        fixed
        left-0 top-0
        w-8 h-8
        pointer-events-none
        z-[99999]
        will-change-transform
      "
      // style={{ transition: 'transform 0.1s ease-out' }} // Smooth follow effect
    >
      {/* Your Logo Here */}
      <img 
        src="/newlogo.png" 
        alt="cursor" 
        className="w-full h-full object-contain hidden md:block"
        // If your logo is dark, you can add a filter to make it pop
        // className="w-full h-full object-contain invert" 
      />
    </div>
  );
};

export default CustomCursor;