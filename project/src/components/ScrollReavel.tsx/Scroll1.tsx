'use client';

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
  TouchEvent,
  WheelEvent,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollExpandMediaProps {
  mediaType?: 'video' | 'image';
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = 'video',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Reset state when media source changes
  useEffect(() => {
    setScrollProgress(0);
    setMediaFullyExpanded(false);
  }, [mediaSrc]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Logic to "catch" the scroll and expand the media
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 10) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.002; // Sensitivity
        const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1);
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => setTouchStartY(e.touches[0].clientY);

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 10) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const newProgress = Math.min(Math.max(scrollProgress + deltaY * scrollFactor, 0), 1);
        setScrollProgress(newProgress);
        if (newProgress >= 1) setMediaFullyExpanded(true);
        setTouchStartY(touchY);
      }
    };

    const handleScroll = () => {
      if (!mediaFullyExpanded) window.scrollTo(0, 0);
    };

    window.addEventListener('wheel', handleWheel as any, { passive: false });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchstart', handleTouchStart as any, { passive: false });
    window.addEventListener('touchmove', handleTouchMove as any, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel as any);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart as any);
      window.removeEventListener('touchmove', handleTouchMove as any);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  useEffect(() => {
    const checkSize = () => setIsMobileState(window.innerWidth < 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Frame dimension logic: Transition from fixed centered box to full-bleed viewport
  const mediaWidth = scrollProgress === 1 ? '100vw' : `${300 + scrollProgress * (isMobileState ? 600 : 1600)}px`;
  const mediaHeight = scrollProgress === 1 ? '100vh' : `${400 + scrollProgress * (isMobileState ? 200 : 500)}px`;
  
  // Text animation: Moves apart AND fades in as expansion completes
  const textTranslateX = scrollProgress * (isMobileState ? 80 : 40);
  const textOpacity = scrollProgress; // Starts at 0, ends at 1

  const firstWord = title ? title.split(' ')[0] : '';
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : '';

  return (
    <div ref={sectionRef} className="overflow-x-hidden transition-colors duration-500">
      <section className="relative flex flex-col items-center justify-start min-h-[100dvh]">
        <div className="relative w-full flex flex-col items-center min-h-[100dvh]">
          
          {/* Background Ambient Layer (Fades out as media expands) */}
          <motion.div
            className="absolute inset-0 z-0 h-full pointer-events-none"
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.2 }}
          >
            <img 
              src={bgImageSrc} 
              alt="Ambient Background" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>

          <div className="container mx-auto flex flex-col items-center justify-center relative z-10 h-[100dvh]">
            
            {/* The Expanding Media Container */}
            <div
              className="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden transition-all duration-700 ease-out"
              style={{
                width: mediaWidth,
                height: mediaHeight,
                borderRadius: scrollProgress === 1 ? '0px' : '2rem',
                boxShadow: scrollProgress === 1 ? 'none' : '0px 20px 60px rgba(0,0,0,0.4)',
              }}
            >
              {mediaType === 'video' ? (
                <video 
                  src={mediaSrc} 
                  poster={posterSrc} 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <img 
                  src={mediaSrc} 
                  className="w-full h-full object-cover" 
                  alt={title} 
                />
              )}
              
              {/* Internal Media Overlay (Brightens as we finish) */}
              <motion.div 
                className="absolute inset-0 bg-black"
                animate={{ opacity: 0.4 - (scrollProgress * 0.4) }}
              />
            </div>

            {/* Title Overlay: Fading and Sliding */}
            <div className={`flex flex-col items-center justify-center gap-6 relative z-10 pointer-events-none ${textBlend ? 'mix-blend-difference' : ''}`}>
              <motion.h2
                className="text-6xl md:text-9xl font-black text-white font-poppins  tracking-tighter"
                style={{ 
                  transform: `translateX(-${textTranslateX}px)`,
                  opacity: textOpacity 
                }}
              >
                {firstWord}
              </motion.h2>
              <motion.h2
                className="text-4xl md:text-5xl font-black text-white font-light font-poppins uppercase tracking-wider"
                style={{ 
                  transform: `translateX(${textTranslateX}px)`,
                  opacity: textOpacity 
                }}
              >
                {restOfTitle}
              </motion.h2>
            </div>

          </div>
        </div>
      </section>

      {/* Smooth reveal of the rest of the page */}
      <AnimatePresence>
        {mediaFullyExpanded && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full bg-white dark:bg-neutral-950 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScrollExpandMedia;