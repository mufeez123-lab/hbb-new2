// components/utils/LocomotiveScrollProvider.tsx
import { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';
import { useLocation } from 'react-router-dom';

const LocomotiveScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef(null);
  const location = useLocation();
  const scrollInstanceRef = useRef<LocomotiveScroll | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    scrollInstanceRef.current = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      smartphone: { smooth: true },
      tablet: { smooth: true },
    });

    return () => {
      scrollInstanceRef.current?.destroy();
      scrollInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      scrollInstanceRef.current?.update();
    }, 100);
  }, [location.pathname]);

  return (
    <div id="main-scroll" data-scroll-container ref={scrollRef}>
      {children}
    </div>
  );
};

export default LocomotiveScrollProvider;
