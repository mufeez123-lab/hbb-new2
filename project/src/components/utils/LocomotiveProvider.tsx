// src/context/LocomotiveProvider.tsx
import { useRef, useEffect, createContext, useContext } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

const LocomotiveContext = createContext<LocomotiveScroll | null>(null);

export const useLocomotive = () => useContext(LocomotiveContext);

export const LocomotiveProvider = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef(null);
  const scrollInstance = useRef<LocomotiveScroll | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      lerp: 0.08,
    });

    scrollInstance.current = scroll;

    return () => {
      scroll.destroy();
    };
  }, []);

  return (
    <LocomotiveContext.Provider value={scrollInstance.current}>
      <div data-scroll-container ref={scrollRef}>
        {children}
      </div>
    </LocomotiveContext.Provider>
  );
};
